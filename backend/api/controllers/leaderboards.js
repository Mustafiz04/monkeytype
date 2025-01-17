const _ = require("lodash");
const LeaderboardsDAO = require("../../dao/leaderboards");
const { verifyIdToken } = require("../../handlers/auth");
const { MonkeyResponse } = require("../../handlers/response");

class LeaderboardsController {
  static async get(req, _res) {
    const { language, mode, mode2, skip, limit } = req.query;
    const { uid } = req.ctx.decodedToken;

    const leaderboard = await LeaderboardsDAO.get(
      mode,
      mode2,
      language,
      skip,
      limit
    );

    const normalizedLeaderboard = _.map(leaderboard, (entry) => {
      return uid && entry.uid === uid
        ? entry
        : _.omit(entry, ["discordId", "uid", "difficulty", "language"]);
    });

    return new MonkeyResponse("Leaderboard retrieved", normalizedLeaderboard);
  }

  static async getRank(req, res) {
    const { language, mode, mode2 } = req.query;
    const { uid } = req.ctx.decodedToken;
    const data = LeaderboardsDAO.getRank(mode, mode2, language, uid);
    return new MonkeyResponse("Rank retrieved", data);
  }
}

module.exports = LeaderboardsController;
