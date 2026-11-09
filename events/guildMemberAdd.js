const { EmbedBuilder } = require('discord.js');
const { ambilPengaturanPesan, daftarkanServer, ambilPeranOtomatis } = require('../utils/database');
const config = require('../config');

function gantiPlaceholder(teks, member) {
  if (!teks) return '';
  return teks
    .replace(/{user}/g, `<@${member.id}>`)
    .replace(/{username}/g, member.user.username)
    .replace(/{server}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount);
}

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    const guild = member.guild;

    // Daftarkan server jika belum ada
    await daftarkanServer(guild.id, guild.name);

    // === 1. Proses Auto Role ===
    try {
      const daftarPeran = await ambilPeranOtomatis(guild.id);
      for (const idPeran of daftarPeran) {
        const peran = guild.roles.cache.get(idPeran);
        if (peran) {
          await member.roles.add(peran).catch(err =>
            console.error(`[AutoRole] Gagal menambah role ${idPeran}:`, err.message)
          );
        }
      }
    } catch (err) {
      console.error('[AutoRole] Error:', err.message);
    }

    // === 2. Proses Welcome ===
    try {
      const pengaturan = await ambilPengaturanPesan(guild.id, 'selamat_datang');
      if (!pengaturan || !pengaturan.id_saluran) return;

      const saluran = guild.channels.cache.get(pengaturan.id_saluran);
      if (!saluran) return;

      const embed = new EmbedBuilder()
        .setColor(pengaturan.warna_embed || config.defaultColor)
        .setTitle(gantiPlaceholder(pengaturan.judul_embed, member) || 'Selamat Datang!')
        .setDescription(
          gantiPlaceholder(pengaturan.deskripsi_embed, member) ||
          `Halo <@${member.id}>, selamat datang di **${guild.name}**!`
        );

      if (pengaturan.footer_embed) {
        embed.setFooter({ text: gantiPlaceholder(pengaturan.footer_embed, member) });
      }
      if (pengaturan.tampilkan_avatar == 1) {
        embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }));
      }
      if (pengaturan.tampilkan_jumlah_anggota == 1) {
        embed.addFields({ name: '👥 Total Anggota', value: `${guild.memberCount}`, inline: true });
      }
      if (pengaturan.url_gambar) {
        embed.setImage(pengaturan.url_gambar);
      }

      await saluran.send({ content: `<@${member.id}>`, embeds: [embed] });
    } catch (err) {
      console.error('[Welcome] Error:', err.message);
    }
  }
};