"use client";

import React, { useState } from "react";
import LifeSortChallenge from "./games/class3/LifeSortChallenge";
import PlantExplorer from "./games/class3/PlantExplorer";
import AnimalKingdomGame from "./games/class3/AnimalKingdomGame";
import HelperMatch from "./games/class3/HelperMatch";
import TransportTrack from "./games/class3/TransportTrack";
import NumberBuilder from "./games/class3/NumberBuilder";
import AddAndWin from "./games/class3/AddAndWin";
import { RotateCcw } from "lucide-react";

interface GameData {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  concept: string;
  badge: string;
  subjects: string[];
  chapter: string;
}

const allGames: GameData[] = [
  { id: "number-builder", title: "Number Builder", subtitle: "Numbers up to 1000", emoji: "123", gradientFrom: "from-blue-400", gradientTo: "to-indigo-500", concept: "Form largest/smallest numbers, place value", badge: "3 levels", subjects: ["math"], chapter: "Ch 1" },
  { id: "add-and-win", title: "Add and Win", subtitle: "Addition", emoji: "+", gradientFrom: "from-green-400", gradientTo: "to-emerald-500", concept: "Solve addition problems", badge: "3 levels", subjects: ["math"], chapter: "Ch 2" },
  { id: "life-sort-challenge", title: "Life Sort Challenge", subtitle: "Living and Non-Living", emoji: "seedling", gradientFrom: "from-green-400", gradientTo: "to-emerald-500", concept: "Classify living things", badge: "3 levels", subjects: ["evs"], chapter: "Ch 1" },
  { id: "plant-explorer", title: "Plant Explorer", subtitle: "Plants Around Us", emoji: "herb", gradientFrom: "from-green-500", gradientTo: "to-teal-500", concept: "Identify plants", badge: "3 levels", subjects: ["evs"], chapter: "Ch 2" },
  { id: "animal-kingdom", title: "Animal Kingdom", subtitle: "Animals Around Us", emoji: "paw-print", gradientFrom: "from-orange-400", gradientTo: "to-amber-500", concept: "Classify animals", badge: "3 levels", subjects: ["evs"], chapter: "Ch 3" },
  { id: "helper-match", title: "Helper Match", subtitle: "People Who Help Us", emoji: "police-officer", gradientFrom: "from-blue-500", gradientTo: "to-indigo-500", concept: "Match helpers", badge: "3 levels", subjects: ["evs"], chapter: "Ch 5" },
  { id: "transport-track", title: "Transport Track", subtitle: "Vehicles and Transport", emoji: "car", gradientFrom: "from-purple-400", gradientTo: "to-violet-500", concept: "Sort vehicles", badge: "3 levels", subjects: ["evs"], chapter: "Ch 6" },
];

const GameSelector: React.FC = () => {
  const [currentGame, setCurrentGame] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const filteredGames = allGames.filter((game) => {
    return selectedSubject === "all" || game.subjects.includes(selectedSubject);
  });

  if (currentGame !== "home") {
    return React.createElement(
      "div",
      { className: "min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4" },
      React.createElement(
        "button",
        { onClick: () => setCurrentGame("home"), className: "fixed top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg" },
        React.createElement(RotateCcw, { size: 18 }),
        " Back"
      ),
      currentGame === "number-builder" && React.createElement(NumberBuilder),
      currentGame === "add-and-win" && React.createElement(AddAndWin),
      currentGame === "life-sort-challenge" && React.createElement(LifeSortChallenge),
      currentGame === "plant-explorer" && React.createElement(PlantExplorer),
      currentGame === "animal-kingdom" && React.createElement(AnimalKingdomGame),
      currentGame === "helper-match" && React.createElement(HelperMatch),
      currentGame === "transport-track" && React.createElement(TransportTrack)
    );
  }

  return React.createElement(
    "div",
    { className: "min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8" },
    React.createElement(
      "div",
      { className: "max-w-6xl mx-auto" },
      React.createElement(
        "div",
        { className: "text-center mb-8" },
        React.createElement("h1", { className: "text-4xl font-bold text-white mb-2" }, "Game Arena"),
        React.createElement("p", { className: "text-xl text-gray-200" }, "Class 3 Math and EVS Games")
      ),
      React.createElement(
        "div",
        { className: "flex justify-center mb-6" },
        React.createElement("div", { className: "bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full" },
          React.createElement("p", { className: "text-white font-medium" }, allGames.length + " Games Available")
        )
      ),
      React.createElement(
        "div",
        { className: "flex justify-center mb-8" },
        React.createElement("div", { className: "bg-white/20 backdrop-blur-sm rounded-xl p-2 flex flex-wrap justify-center gap-2" },
          React.createElement("button", { onClick: () => setSelectedSubject("all"), className: "px-4 py-2 rounded-lg font-medium text-white hover:bg-white/20" }, "All"),
          React.createElement("button", { onClick: () => setSelectedSubject("math"), className: "px-4 py-2 rounded-lg font-medium text-white hover:bg-white/20" }, "Math"),
          React.createElement("button", { onClick: () => setSelectedSubject("evs"), className: "px-4 py-2 rounded-lg font-medium text-white hover:bg-white/20" }, "EVS")
        )
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" },
        filteredGames.map((game) =>
          React.createElement(
            "div",
            { key: game.id, onClick: () => setCurrentGame(game.id), className: "bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all cursor-pointer" },
            React.createElement(
              "div",
              { className: "bg-gradient-to-r " + game.gradientFrom + " " + game.gradientTo + " p-6 text-white" },
              React.createElement(
                "div",
                { className: "flex items-center gap-4" },
                React.createElement("span", { className: "text-5xl" }, game.emoji),
                React.createElement(
                  "div",
                  null,
                  React.createElement("h3", { className: "text-xl font-bold" }, game.title),
                  React.createElement("p", { className: "text-white/90" }, game.subtitle)
                )
              )
            ),
            React.createElement(
              "div",
              { className: "p-5" },
              React.createElement("p", { className: "text-sm text-gray-600 mb-3" }, game.concept),
              React.createElement(
                "div",
                { className: "flex justify-between items-center" },
                React.createElement("span", { className: "text-xs bg-gray-100 px-2 py-1 rounded" }, game.chapter),
                React.createElement("span", { className: "text-xs px-2 py-1 rounded bg-blue-500 text-white" }, game.badge)
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "mt-8 text-center text-white/70" },
        React.createElement("p", null, "Showing " + filteredGames.length + " games")
      )
    )
  );
};

export default GameSelector;
