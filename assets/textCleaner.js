export const textCleaner = {
  upperAllFirst: (text) => {
    if (text !== undefined) {
      const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
      };
      return text.split(" ").map(capitalize).join(" ");
    } else return;
  },
  upperAllFirstMark: (text, mark) => {
    if (text !== undefined) {
      const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
      };
      return text.split(" ").map(capitalize).join(`${mark}`);
    } else return;
  },
  marksLowerCase: (text, mark) => {
    if (text !== undefined) {
      return text.replace(/\s+/g, `${mark}`).toLowerCase();
    } else return;
  },
  // \$ <- removind dolar sign
  removeTrash: (text) => {
    if (text !== undefined) {
      return text.replace(/^\s+|\s+$/g, "");
    } else return;
  },
  removeAllNumbers: (text) => {
    if (text !== undefined) {
      return text.replace(/[0-9]|\.|\s/g, '');
    } else return;
  },
  removeAllLetters: (text) => {
    if (text !== undefined) {
      return text.replace(/[^\d.-]/g, '');
    } else return;
  },
  getSpecText: (text, remove, nextLetters) => {
    if (text !== undefined) {
      let words = text.split(`${remove}`);
      let word = words[0];
      let wordAfter = words[1].slice(0, `${nextLetters}`);
      return `${wordAfter} ${word}`;
    } else return;
  },
};
