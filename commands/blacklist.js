exports.names = ['blacklist'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    var dj = bot.getDJ();
    var media = bot.getMedia();

    var params = _.rest(data.message.split(' '), 1);
    var message = '';

    if (params.length > 0) {
        message = params.join(' ').trim();
    }

    if (dj == null) {
        return;
    }

    if (bot.hasPermission(bot.getUser(data.user.id), 'queue-order')) {

        console.log('[BLACKLIST] ' + data.user.username + ' blacklisted ' + media.title + ': ' + message);

        getDbUserFromSiteUser(dj, function (row) {
            var userData = {
                type: 'blacklist',
                details: 'Blacklisted ' + media.name + ' (spun by ' + data.user.username + '): ' + message,
                user_id: row.id,
                mod_user_id: data.user.db.id
            };
            models.Karma.create(userData);
        });

        models.Song.update({is_banned: 1, banned_reason: message}, {where: {site_id: media.id}});
        bot.sendChat("The song \"" + media.name + "\" has been blacklisted.");

        bot.moderateSkip();
    }
};

