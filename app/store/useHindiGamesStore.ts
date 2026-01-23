import { create } from 'zustand';

export type HindiGameType = 'story' | 'vocabulary' | 'grammar' | 'comprehension' | 'moral';
export type DifficultyType = 'easy' | 'medium' | 'hard' | 'master';

export interface HindiQuestion {
  id: string;
  question: string;
  questionEnglish?: string;
  type: 'match' | 'sequence' | 'fill_blank' | 'arrange' | 'choose' | 'explain' | 'compare' | 'predict';
  options?: string[];
  matchPairs?: { left: string; right: string }[];
  sequence?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  chapter: string;
  topic: string;
  difficulty: DifficultyType;
  points: number;
}

export interface HindiGameState {
  gameType: HindiGameType;
  currentLevel: number;
  questions: HindiQuestion[];
  currentQuestionIndex: number;
  currentQuestion: HindiQuestion | null;
  selectedAnswer: string | null;
  answered: boolean;
  showFeedback: boolean;
  consecutiveCorrect: number;
  hintUsed: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
  levelCompleted: boolean;
  passedLevel: boolean;
  score: number;
  totalAnswered: number;
  correctAnswers: number;
  
  startGame: (gameType: HindiGameType, level: number) => void;
  selectAnswer: (answer: string) => boolean;
  useHint: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
  retryLevel: () => void;
  getAccuracy: () => number;
  getTelemetryLog: () => Record<string, unknown>;
}

// Hindi story data - Class 3 chapters
const hindiStories: Record<string, {
  title: string;
  characters: string[];
  moral: string;
  events?: { order: number; event: string }[];
  vocabulary: { word: string; meaning: string }[];
}> = {
  rakh_ki_rassi: {
    title: 'राख की रस्सी',
    characters: ['राजा', 'लालची व्यापारी', 'बुद्धिमान मंत्री'],
    moral: 'लालच बुरी बला है',
    events: [
      { order: 1, event: 'राजा ने एक कठिन कार्य दिया' },
      { order: 2, event: 'लालची व्यापारी लालच में आया' },
      { order: 3, event: 'राजा ने राख की रस्सी बनाने को कहा' },
      { order: 4, event: 'व्यापारी ने असंभव कार्य स्वीकार किया' },
      { order: 5, event: 'व्यापारी असफल हुआ' },
      { order: 6, event: 'राजा ने सबक सिखाया' },
    ],
    vocabulary: [
      { word: 'रस्सी', meaning: 'rope' },
      { word: 'लालच', meaning: 'greed' },
      { word: 'कठिन', meaning: 'difficult' },
    ],
  },
  fason_ke_tyohar: {
    title: 'फसलों के त्योहार',
    characters: ['किसान', 'परिवार', 'गाँव वाले'],
    moral: 'मेहनत का फल मीठा होता है',
    events: [
      { order: 1, event: 'किसान ने बीज बोए' },
      { order: 2, event: 'पानी और खाद दी' },
      { order: 3, event: 'फसल तैयार हुई' },
      { order: 4, event: 'कटाई की गई' },
      { order: 5, event: 'त्योहार मनाया गया' },
      { order: 6, event: 'सभी ने खुशी मनाई' },
    ],
    vocabulary: [
      { word: 'फसल', meaning: 'crop' },
      { word: 'त्योहार', meaning: 'festival' },
      { word: 'कटाई', meaning: 'harvest' },
    ],
  },
  chitthi_ka_safar: {
    title: 'चिट्ठी का सफर',
    characters: ['रामू', 'पिताजी', 'डाकिया'],
    moral: 'संदेश का महत्व',
    events: [
      { order: 1, event: 'पिताजी ने चिट्ठी लिखी' },
      { order: 2, event: 'चिट्ठी डाकघर पहुँची' },
      { order: 3, event: 'डाकिया ने चिट्ठी उठाई' },
      { order: 4, event: 'चिट्ठी गाँव पहुँची' },
      { order: 5, event: 'रामू को चिट्ठी मिली' },
      { order: 6, event: 'रामू खुश हुआ' },
    ],
    vocabulary: [
      { word: 'चिट्ठी', meaning: 'letter' },
      { word: 'डाकिया', meaning: 'postman' },
      { word: 'सफर', meaning: 'journey' },
    ],
  },
  guru_aur_chela: {
    title: 'गुरु और चेला',
    characters: ['गुरु', 'चेला', 'गाँव वाले'],
    moral: 'शिक्षा का महत्व',
    events: [
      { order: 1, event: 'चेला गुरु के पास पहुँचा' },
      { order: 2, event: 'गुरु ने पढ़ना सिखाया' },
      { order: 3, event: 'चेला ने मेहनत की' },
      { order: 4, event: 'गुरु ने ज्ञान दिया' },
      { order: 5, event: 'चेला सीख गया' },
      { order: 6, event: 'चेला ज्ञानी बना' },
    ],
    vocabulary: [
      { word: 'गुरु', meaning: 'teacher' },
      { word: 'चेला', meaning: 'student' },
      { word: 'ज्ञान', meaning: 'knowledge' },
    ],
  },
  kissa_ek_kanjar_ka: {
    title: 'किस्सा एक कंजर का',
    characters: ['कंजर', 'गाँव वाले', 'राजा'],
    moral: 'सभी का सम्मान करें',
    events: [
      { order: 1, event: 'कंजर गाँव में आया' },
      { order: 2, event: 'लोगों ने उसे नजरअंदाज किया' },
      { order: 3, event: 'कंजर ने मदद की' },
      { order: 4, event: 'सभी को अहसास हुआ' },
      { order: 5, event: 'सभी ने सम्मान दिया' },
      { order: 6, event: 'समानता का संदेश मिला' },
    ],
    vocabulary: [
      { word: 'कंजर', meaning: 'nomad' },
      { word: 'सम्मान', meaning: 'respect' },
      { word: 'समानता', meaning: 'equality' },
    ],
  },
};

const generateStoryQuestions = (difficulty: DifficultyType): HindiQuestion[] => {
  const questions: HindiQuestion[] = [];
  const stories = Object.values(hindiStories);
  
  stories.forEach((story, idx) => {
    if (difficulty === 'easy') {
      // Match character to action
      questions.push({
        id: `story_match_${idx}_1`,
        question: `${story.title} कहानी में पात्रों को उनके काम से मिलाओ:`,
        type: 'match',
        matchPairs: [
          { left: 'राजा', right: 'न्याय करना' },
          { left: 'गुरु', right: 'पढ़ाना' },
          { left: 'किसान', right: 'खेती करना' },
          { left: 'डाकिया', right: 'चिट्ठी पहुँचाना' },
        ],
        correctAnswer: ['राजा-न्याय करना', 'गुरु-पढ़ाना', 'किसान-खेती करना', 'डाकिया-चिट्ठी पहुँचाना'],
        hint: 'कहानी में कौन क्या करता है, सोचो',
        explanation: `इस कहानी में पात्र अपनी भूमिका निभाते हैं।`,
        chapter: story.title,
        topic: 'पात्र और घटनाएँ',
        difficulty: 'easy',
        points: 10,
      });
      
      // Sequence events
      if (story.events && story.events.length > 0) {
        const shuffledEvents = [...story.events].sort(() => Math.random() - 0.5).slice(0, 4);
        questions.push({
          id: `story_seq_${idx}_2`,
          question: `${story.title} कहानी की घटनाओं को सही क्रम में लगाओ:`,
          type: 'sequence',
          sequence: shuffledEvents.map(e => e.event),
          correctAnswer: story.events.slice(0, 4).map(e => e.event),
          hint: 'पहले क्या हुआ, फिर क्या हुआ?',
          explanation: `घटनाएँ क्रम में होती हैं।`,
          chapter: story.title,
          topic: 'क्रम',
          difficulty: 'easy',
          points: 10,
        });
      }
    }
    
    if (difficulty === 'medium') {
      // Arrange events
      if (story.events && story.events.length > 0) {
        questions.push({
          id: `story_arrange_${idx}_1`,
          question: `${story.title} कहानी की घटनाओं को सही क्रम में व्यवस्थित करो:`,
          type: 'arrange',
          options: story.events.map(e => e.event),
          correctAnswer: story.events.map(e => e.event),
          hint: 'कहानी की शुरुआत से अंत तक सोचो',
          explanation: `सभी घटनाएँ क्रम में हैं।`,
          chapter: story.title,
          topic: 'क्रम',
          difficulty: 'medium',
          points: 15,
        });
      }
    }
    
    if (difficulty === 'hard') {
      // Explain cause-effect
      questions.push({
        id: `story_explain_${idx}_1`,
        question: `${story.title} कहानी में, गुरु ने ऐसा क्यों कहा? कारण बताओ:`,
        type: 'explain',
        correctAnswer: 'गुरु चाहता था कि चेला सही रास्ता सीखे',
        hint: 'गुरु का उद्देश्य क्या था?',
        explanation: `गुरु हमेशा बच्चों की भलाई चाहते हैं।`,
        chapter: story.title,
        topic: 'कारण–परिणाम',
        difficulty: 'hard',
        points: 20,
      });
    }
    
    if (difficulty === 'master') {
      // Predict what-if
      questions.push({
        id: `story_predict_${idx}_1`,
        question: `${story.title} कहानी में, अगर चेला गुरु की बात न मानता तो क्या होता?`,
        type: 'predict',
        correctAnswer: 'चेला सही रास्ता न सीख पाता और गलतियाँ करता',
        hint: 'गुरु के बिना क्या हो सकता था?',
        explanation: `शिक्षा का महत्व बहुत है।`,
        chapter: story.title,
        topic: 'अगर–तो',
        difficulty: 'master',
        points: 25,
      });
      
      // Choose moral message
      questions.push({
        id: `story_choose_${idx}_2`,
        question: `${story.title} कहानी का मुख्य संदेश क्या है? सही विकल्प चुनो और समझाओ:`,
        type: 'choose',
        options: [story.moral, 'लालच करना ठीक है', 'काम न करना बेहतर है', 'झूठ बोलना सही है'],
        correctAnswer: story.moral,
        hint: 'कहानी क्या सिखाती है?',
        explanation: `यह कहानी ${story.moral} सिखाती है।`,
        chapter: story.title,
        topic: 'संदेश',
        difficulty: 'master',
        points: 25,
      });
    }
  });
  
  return questions.sort(() => Math.random() - 0.5).slice(0, 15);
};

const generateVocabularyQuestions = (difficulty: DifficultyType): HindiQuestion[] => {
  const questions: HindiQuestion[] = [];
  
  const vocabularyWords = [
    { word: 'सुंदर', meaning: 'beautiful', synonym: 'खूबसूरत', antonym: 'बदसूरत' },
    { word: 'खुश', meaning: 'happy', synonym: 'प्रसन्न', antonym: 'दुखी' },
    { word: 'मेहनत', meaning: 'hard work', synonym: 'परिश्रम', antonym: 'आलस' },
    { word: 'दोस्त', meaning: 'friend', synonym: 'मित्र', antonym: 'दुश्मन' },
    { word: 'प्यार', meaning: 'love', synonym: 'प्रेम', antonym: 'घृणा' },
  ];
  
  vocabularyWords.forEach((vocab, idx) => {
    if (difficulty === 'easy') {
      // Match word to picture/meaning
      questions.push({
        id: `vocab_match_${idx}_1`,
        question: `"${vocab.word}" शब्द का अर्थ मिलाओ:`,
        type: 'match',
        matchPairs: [
          { left: vocab.word, right: vocab.meaning },
          { left: 'किताब', right: 'book' },
          { left: 'पानी', right: 'water' },
          { left: 'सूरज', right: 'sun' },
        ],
        correctAnswer: [`${vocab.word}-${vocab.meaning}`],
        hint: 'शब्द का मतलब क्या है?',
        explanation: `"${vocab.word}" का अर्थ "${vocab.meaning}" है।`,
        chapter: 'शब्द अर्थ',
        topic: 'शब्द–अर्थ',
        difficulty: 'easy',
        points: 10,
      });
    }
    
    if (difficulty === 'medium') {
      // Match synonyms
      questions.push({
        id: `vocab_synonym_${idx}_1`,
        question: `"${vocab.word}" का समानार्थी शब्द मिलाओ:`,
        type: 'match',
        matchPairs: [
          { left: vocab.word, right: vocab.synonym },
          { left: 'बड़ा', right: 'विशाल' },
          { left: 'छोटा', right: 'नन्हा' },
        ],
        correctAnswer: [`${vocab.word}-${vocab.synonym}`],
        hint: 'समान मतलब वाला शब्द',
        explanation: `"${vocab.word}" का समानार्थी "${vocab.synonym}" है।`,
        chapter: 'समानार्थी',
        topic: 'समानार्थी शब्द',
        difficulty: 'medium',
        points: 15,
      });
    }
    
    if (difficulty === 'hard') {
      // Choose correct word in sentence
      questions.push({
        id: `vocab_choose_${idx}_1`,
        question: `वाक्य में सही शब्द का प्रयोग करो: "वह बहुत _____ लग रहा था।"`,
        type: 'choose',
        options: [vocab.word, vocab.antonym, vocab.synonym, 'अन्य'],
        correctAnswer: vocab.word,
        hint: 'वाक्य के संदर्भ को देखो',
        explanation: `इस वाक्य में "${vocab.word}" सही है।`,
        chapter: 'शब्द प्रयोग',
        topic: 'शब्द प्रयोग',
        difficulty: 'hard',
        points: 20,
      });
    }
  });
  
  return questions.sort(() => Math.random() - 0.5).slice(0, 15);
};

const generateGrammarQuestions = (difficulty: DifficultyType): HindiQuestion[] => {
  const questions: HindiQuestion[] = [];
  
  if (difficulty === 'easy') {
    // Match words to form sentence
    questions.push({
      id: 'grammar_match_1',
      question: 'टूटे वाक्य को जोड़कर सही वाक्य बनाओ:',
      type: 'arrange',
      options: ['राम', 'स्कूल', 'जाता', 'है'],
      correctAnswer: ['राम', 'स्कूल', 'जाता', 'है'],
      hint: 'वाक्य का सही क्रम सोचो',
      explanation: 'सही वाक्य: राम स्कूल जाता है।',
      chapter: 'वाक्य निर्माण',
      topic: 'वाक्य जोड़ना',
      difficulty: 'easy',
      points: 10,
    });
  }
  
  if (difficulty === 'medium') {
    // Change tense
    questions.push({
      id: 'grammar_tense_1',
      question: 'वाक्य का काल बदलो: "वह खेल रहा है" (भूतकाल में)',
      type: 'fill_blank',
      correctAnswer: 'वह खेल रहा था',
      hint: 'भूतकाल में "था/थी" आता है',
      explanation: 'भूतकाल में "वह खेल रहा था" होगा।',
      chapter: 'काल',
      topic: 'काल बदलना',
      difficulty: 'medium',
      points: 15,
    });
    
    // Singular to plural
    questions.push({
      id: 'grammar_plural_1',
      question: 'एकवचन को बहुवचन में बदलो: "लड़का"',
      type: 'fill_blank',
      correctAnswer: 'लड़के',
      hint: 'बहुवचन में बदलाव होता है',
      explanation: '"लड़का" का बहुवचन "लड़के" है।',
      chapter: 'वचन',
      topic: 'वचन बदलना',
      difficulty: 'medium',
      points: 15,
    });
  }
  
  if (difficulty === 'hard') {
    // Fix wrong sentence
    questions.push({
      id: 'grammar_fix_1',
      question: 'गलत वाक्य ठीक करो: "वह खाना खा रहे है"',
      type: 'fill_blank',
      correctAnswer: 'वह खाना खा रहा है',
      hint: 'क्रिया सर्वनाम के अनुसार होनी चाहिए',
      explanation: 'सही वाक्य: "वह खाना खा रहा है" (वह = एकवचन पुल्लिंग)',
      chapter: 'वाक्य सुधार',
      topic: 'वाक्य ठीक करना',
      difficulty: 'hard',
      points: 20,
    });
  }
  
  if (difficulty === 'master') {
    // Make sentence from words
    questions.push({
      id: 'grammar_make_1',
      question: 'दिए गए शब्दों से सही वाक्य बनाओ: स्कूल, जाता, है, वह',
      type: 'arrange',
      options: ['स्कूल', 'जाता', 'है', 'वह'],
      correctAnswer: ['वह', 'स्कूल', 'जाता', 'है'],
      hint: 'कर्ता + कर्म + क्रिया + काल',
      explanation: 'सही वाक्य: वह स्कूल जाता है।',
      chapter: 'वाक्य निर्माण',
      topic: 'वाक्य बनाना',
      difficulty: 'master',
      points: 25,
    });
  }
  
  return questions.sort(() => Math.random() - 0.5).slice(0, 15);
};

const generateComprehensionQuestions = (difficulty: DifficultyType): HindiQuestion[] => {
  const questions: HindiQuestion[] = [];
  
  if (difficulty === 'easy') {
    // Choose emotion (emoji based)
    questions.push({
      id: 'comp_emotion_1',
      question: 'कहानी में पात्र कैसा महसूस कर रहा था? भाव चुनो:',
      type: 'choose',
      options: ['😊 खुश', '😢 दुखी', '😡 गुस्सा', '😴 थका'],
      correctAnswer: '😊 खुश',
      hint: 'कहानी के संदर्भ को देखो',
      explanation: 'पात्र खुश महसूस कर रहा था क्योंकि उसे सफलता मिली।',
      chapter: 'भावना',
      topic: 'भाव पहचानना',
      difficulty: 'easy',
      points: 10,
    });
  }
  
  if (difficulty === 'medium') {
    // Choose correct decision
    questions.push({
      id: 'comp_decision_1',
      question: 'इस स्थिति में सही निर्णय क्या होगा?',
      type: 'choose',
      options: ['दोस्त की मदद करना', 'मदद न करना', 'दोस्त को दोष देना', 'भाग जाना'],
      correctAnswer: 'दोस्त की मदद करना',
      hint: 'अच्छा काम क्या है?',
      explanation: 'दोस्त की मदद करना सही निर्णय है।',
      chapter: 'निर्णय',
      topic: 'सही निर्णय',
      difficulty: 'medium',
      points: 15,
    });
  }
  
  if (difficulty === 'hard') {
    // What would you do?
    questions.push({
      id: 'comp_whatif_1',
      question: 'अगर तुम इस स्थिति में होते तो क्या करते?',
      type: 'explain',
      correctAnswer: 'मैं दोस्त की मदद करता और समस्या सुलझाता',
      hint: 'अपने अनुभव से सोचो',
      explanation: 'दोस्तों की मदद करना अच्छा गुण है।',
      chapter: 'तर्क',
      topic: 'तुम क्या करोगे',
      difficulty: 'hard',
      points: 20,
    });
  }
  
  if (difficulty === 'master') {
    // Predict alternative ending
    questions.push({
      id: 'comp_predict_1',
      question: 'कहानी का दूसरा अंत सोचो और बताओ क्या हो सकता था?',
      type: 'predict',
      correctAnswer: 'अगर पात्र ने मदद न की होती तो समस्या बढ़ सकती थी',
      hint: 'वैकल्पिक परिणाम सोचो',
      explanation: 'कहानी का अलग अंत भी संभव था।',
      chapter: 'अभिव्यक्ति',
      topic: 'वैकल्पिक अंत',
      difficulty: 'master',
      points: 25,
    });
  }
  
  return questions.sort(() => Math.random() - 0.5).slice(0, 15);
};

const generateMoralQuestions = (difficulty: DifficultyType): HindiQuestion[] => {
  const questions: HindiQuestion[] = [];
  
  if (difficulty === 'easy') {
    // Identify good deeds
    questions.push({
      id: 'moral_good_1',
      question: 'इनमें से अच्छा काम कौन सा है?',
      type: 'choose',
      options: ['झूठ बोलना', 'मदद करना', 'चोरी करना', 'झगड़ा करना'],
      correctAnswer: 'मदद करना',
      hint: 'अच्छा काम वह है जो दूसरों की भलाई करे',
      explanation: 'मदद करना अच्छा काम है।',
      chapter: 'ईमानदारी',
      topic: 'अच्छा–बुरा',
      difficulty: 'easy',
      points: 10,
    });
  }
  
  if (difficulty === 'medium') {
    // Match situation to decision
    questions.push({
      id: 'moral_situation_1',
      question: 'इस स्थिति में सही व्यवहार क्या होगा?',
      type: 'choose',
      options: ['सम्मान से बात करना', 'गुस्सा करना', 'नजरअंदाज करना', 'मजाक उड़ाना'],
      correctAnswer: 'सम्मान से बात करना',
      hint: 'सभी के साथ सम्मान से बात करें',
      explanation: 'सभी के साथ सम्मान से बात करना सही है।',
      chapter: 'सम्मान',
      topic: 'सही व्यवहार',
      difficulty: 'medium',
      points: 15,
    });
  }
  
  if (difficulty === 'hard') {
    // Explain consequences
    questions.push({
      id: 'moral_consequence_1',
      question: 'गलत निर्णय का परिणाम क्या हो सकता है?',
      type: 'explain',
      correctAnswer: 'गलत निर्णय से समस्या बढ़ सकती है और लोगों को दुख हो सकता है',
      hint: 'गलत काम का बुरा असर सोचो',
      explanation: 'गलत निर्णय से हमेशा नुकसान होता है।',
      chapter: 'जिम्मेदारी',
      topic: 'कारण–परिणाम',
      difficulty: 'hard',
      points: 20,
    });
  }
  
  if (difficulty === 'master') {
    // Connect to real life
    questions.push({
      id: 'moral_reallife_1',
      question: 'इस सीख को अपने जीवन से जोड़ो और बताओ कैसे लागू करोगे?',
      type: 'explain',
      correctAnswer: 'मैं रोज स्कूल में दोस्तों की मदद करूंगा और सभी के साथ अच्छा व्यवहार करूंगा',
      hint: 'वास्तविक जीवन में कैसे उपयोग करोगे?',
      explanation: 'यह सीख हमारे दैनिक जीवन में महत्वपूर्ण है।',
      chapter: 'सहयोग',
      topic: 'वास्तविक जीवन',
      difficulty: 'master',
      points: 25,
    });
  }
  
  return questions.sort(() => Math.random() - 0.5).slice(0, 15);
};

const generateQuestionSet = (gameType: HindiGameType, level: number): HindiQuestion[] => {
  const difficulty: DifficultyType = level === 1 ? 'easy' : level === 2 ? 'medium' : level === 3 ? 'hard' : 'master';
  
  switch (gameType) {
    case 'story':
      return generateStoryQuestions(difficulty);
    case 'vocabulary':
      return generateVocabularyQuestions(difficulty);
    case 'grammar':
      return generateGrammarQuestions(difficulty);
    case 'comprehension':
      return generateComprehensionQuestions(difficulty);
    case 'moral':
      return generateMoralQuestions(difficulty);
    default:
      return [];
  }
};

export const useHindiGamesStore = create<HindiGameState>((set, get) => ({
  gameType: 'story',
  currentLevel: 1,
  questions: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  selectedAnswer: null,
  answered: false,
  showFeedback: false,
  consecutiveCorrect: 0,
  hintUsed: false,
  gameStarted: false,
  gameCompleted: false,
  levelCompleted: false,
  passedLevel: false,
  score: 0,
  totalAnswered: 0,
  correctAnswers: 0,

  startGame: (gameType: HindiGameType, level: number) => {
    const questionSet = generateQuestionSet(gameType, level);
    const firstQuestion = questionSet[0];
    
    set({
      gameType,
      currentLevel: level,
      questions: questionSet,
      currentQuestionIndex: 0,
      currentQuestion: firstQuestion,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      consecutiveCorrect: 0,
      hintUsed: false,
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      score: 0,
      totalAnswered: 0,
      correctAnswers: 0,
    });
  },

  selectAnswer: (answer: string) => {
    const state = get();
    if (state.answered || !state.currentQuestion) return false;
    
    const isCorrect = answer.toLowerCase().trim() === 
      (Array.isArray(state.currentQuestion.correctAnswer) 
        ? state.currentQuestion.correctAnswer[0].toLowerCase().trim()
        : state.currentQuestion.correctAnswer.toLowerCase().trim());
    
    const newStreak = isCorrect ? state.consecutiveCorrect + 1 : 0;
    const bonusPoints = Math.min(newStreak * 3, 15);
    const questionPoints = state.currentQuestion.points + bonusPoints;
    
    set({
      selectedAnswer: answer,
      answered: true,
      showFeedback: true,
      totalAnswered: state.totalAnswered + 1,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      score: isCorrect ? state.score + questionPoints : state.score,
      consecutiveCorrect: newStreak,
    });
    
    return isCorrect;
  },

  useHint: () => {
    const state = get();
    if (state.hintUsed || !state.currentQuestion || state.answered) return;
    
    set({
      hintUsed: true,
      score: Math.max(0, state.score - 5),
    });
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;
    
    if (nextIndex >= state.questions.length) {
      const accuracy = state.totalAnswered > 0 ? state.correctAnswers / state.totalAnswered : 0;
      const passed = accuracy >= 0.8;
      set({
        gameCompleted: true,
        levelCompleted: true,
        passedLevel: passed,
      });
    } else {
      const nextQuestion = state.questions[nextIndex];
      set({
        currentQuestionIndex: nextIndex,
        currentQuestion: nextQuestion,
        selectedAnswer: null,
        answered: false,
        showFeedback: false,
        hintUsed: false,
      });
    }
  },

  resetGame: () => {
    set({
      gameStarted: false,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      currentLevel: 1,
      score: 0,
      currentQuestion: null,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      totalAnswered: 0,
      correctAnswers: 0,
      questions: [],
      consecutiveCorrect: 0,
      hintUsed: false,
    });
  },

  retryLevel: () => {
    const state = get();
    const questionSet = generateQuestionSet(state.gameType, state.currentLevel);
    const firstQuestion = questionSet[0];
    
    set({
      gameStarted: true,
      gameCompleted: false,
      levelCompleted: false,
      passedLevel: false,
      score: 0,
      currentQuestion: firstQuestion,
      questions: questionSet,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answered: false,
      showFeedback: false,
      totalAnswered: 0,
      correctAnswers: 0,
      consecutiveCorrect: 0,
      hintUsed: false,
    });
  },

  getAccuracy: () => {
    const state = get();
    if (state.totalAnswered === 0) return 1;
    return state.correctAnswers / state.totalAnswered;
  },

  getTelemetryLog: () => {
    const state = get();
    return {
      gameType: state.gameType,
      level: state.currentLevel,
      score: state.score,
      accuracy: state.getAccuracy(),
      totalQuestions: state.totalAnswered,
      passed: state.passedLevel,
      timestamp: new Date().toISOString(),
    };
  },
}));
