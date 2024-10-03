import Bool "mo:base/Bool";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Order "mo:base/Order";

actor {
  stable var highScores : [(Text, Int)] = [];
  stable var playerProgress : [(Text, Int)] = [];

  public func addHighScore(name : Text, score : Int) : async () {
    highScores := Array.sort<(Text, Int)>(
      Array.append(highScores, [(name, score)]),
      func (a : (Text, Int), b : (Text, Int)) : Order.Order {
        Int.compare(b.1, a.1)
      }
    );
    if (highScores.size() > 10) {
      highScores := Array.subArray(highScores, 0, 10);
    };
  };

  public query func getHighScores() : async [(Text, Int)] {
    highScores
  };

  public func saveProgress(name : Text, level : Int) : async () {
    switch (Array.find(playerProgress, func (entry : (Text, Int)) : Bool { entry.0 == name })) {
      case null {
        playerProgress := Array.append(playerProgress, [(name, level)]);
      };
      case (?existingEntry) {
        playerProgress := Array.map<(Text, Int), (Text, Int)>(
          playerProgress,
          func (entry : (Text, Int)) : (Text, Int) {
            if (entry.0 == name) { (name, level) } else { entry }
          }
        );
      };
    };
  };

  public query func getProgress(name : Text) : async ?Int {
    Option.map(
      Array.find(playerProgress, func (entry : (Text, Int)) : Bool { entry.0 == name }),
      func (entry : (Text, Int)) : Int { entry.1 }
    )
  };
}
