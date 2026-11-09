const { EmbedBuilder } = require('discord.js');
const { ambilPengaturanPesan, daftarkanServer } = require('../utils/database');
const config = require('../config');

function gantiPlaceholder(teks, member) {
  if (!teks) return '';
  return teks
    .replace(/{user}/g, `${member.user.username}`)
    .replace(/{username}/g, member.user.username)
    .replace(/{server}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount);
}

module.exports = {
  name: 'guildMemberRemove',
  once: false,
  async execute(member) {
    const guild = member.guild;
    await daftarkanServer(guild.id, guild.name);

    try {
      const pengaturan = await ambilPengaturanPesan(guild.id, 'selamat_jalan');
      if (!pengaturan || !pengaturan.id_saluran) return;

      const saluran = guild.channels.cache.get(pengaturan.id_saluran);
      if (!saluran) return;

      const embed = new EmbedBuilder()
        .setColor(pengaturan.warna_embed || '#EF4444')
        .setTitle(gantiPlaceholder(pengaturan.judul_embed, member) || 'Selamat Jalan')
        .setDescription(
          gantiPlaceholder(pengaturan.deskripsi_embed, member) ||
          `**${member.user.username}** telah meninggalkan server.`
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

      await saluran.send({ embeds: [embed] });
    } catch (err) {
      console.error('[Goodbye] Error:', err.message);
    }
  }
};