// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract GAME2048 {
    struct Game {
        address gamerAddr;
        uint256 gameTime;
        uint256 score;
        string lastBoardState;
        uint8 gameStatus;
    }

    struct LeaderBoard {
        uint8 maxRecord;
        Game[] leaderBoardRecord;
        uint32 minScore;
    }

    LeaderBoard leaderBoard;

    event gameUpload(address indexed sender, Game record);
    event fallbackcalled(address sender, uint256 value, bytes data);
    event leaderBoardUpdate();

    fallback() external payable {
        emit fallbackcalled(msg.sender, msg.value, msg.data);
    }

    constructor() {
        leaderBoard.maxRecord = 5;
    }

    function uploadRecord(Game memory record) public {
        emit gameUpload(msg.sender, record);
        updateLeaderBoard(record);
    }

    function updateLeaderBoard(Game memory record) internal {
        if (record.score < leaderBoard.minScore) {
            return;
        }

        Game[] storage leaderBoardRecord = leaderBoard.leaderBoardRecord;
        leaderBoardRecord.push(record); // Append the record to the end of the array
        uint256 insertIndex = leaderBoardRecord.length - 1;

        for (uint8 i = 0; i < leaderBoardRecord.length; i++) {
            if (leaderBoardRecord[i].score < record.score) {
                insertIndex = i;
                break;
            }
        }

        for (uint256 j = leaderBoardRecord.length - 1; j > insertIndex; j--) {
            leaderBoardRecord[j] = leaderBoardRecord[j - 1];
        }
        leaderBoardRecord[insertIndex] = record; // Replace the existing element
        if (leaderBoardRecord.length > leaderBoard.maxRecord) {
            leaderBoardRecord.pop();
        }
        emit leaderBoardUpdate();
    }

    function getLeaderBoard() public view returns (Game[] memory) {
        return leaderBoard.leaderBoardRecord;
    }
}
