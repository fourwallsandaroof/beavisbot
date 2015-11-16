exports.names = ['skip'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {

    var dj = bot.getDJ();
    var media = bot.getMedia();

    if (dj == null) {
        return;
    }

    if (media && (data.user.id == dj.id || bot.hasPermission(bot.getUser(data.user.id), 'skip'))) {

        console.log('[SKIP] ' + data.user.username + ' skipped ' + dj.username + ' - ' + media.name + ' (' + media.id + ')');
        bot.moderateSkip();

        if (data.user.id !== dj.id) {
            getDbUserFromSiteUser(dj.id, function (row) {
                var userData = {
                    type: 'skip',
                    details: media.id + ': ' + media.name + ' (skipped by ' + data.user.username + ')',
                    user_id: row.id,
                    mod_user_id: data.user.db.id
                };
                models.Karma.create(userData);
            });
        }
    }
};

