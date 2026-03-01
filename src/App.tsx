import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Trophy,
  Filter,
  Info
} from "lucide-react";
import { Question, Difficulty, GrammarPoint, UserAnswer } from "./types";
import { mockQuestions } from "./questions";

export default function App() {
  const [currentStep, setCurrentStep] = useState<"landing" | "quiz" | "result">("landing");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<GrammarPoint | "All">("All");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number | null>(null);

  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter(q => {
      const diffMatch = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      const catMatch = selectedCategory === "All" || q.category === selectedCategory;
      return diffMatch && catMatch;
    });
  }, [selectedDifficulty, selectedCategory]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const startQuiz = () => {
    if (filteredQuestions.length === 0) return;
    setCurrentStep("quiz");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTempSelectedIndex(null);
    setShowExplanation(false);
  };

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setTempSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (tempSelectedIndex === null) return;

    const isCorrect = tempSelectedIndex === currentQuestion.correctIndex;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: tempSelectedIndex,
      isCorrect,
    };

    setUserAnswers([...userAnswers, newAnswer]);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTempSelectedIndex(null);
      setShowExplanation(false);
    } else {
      setCurrentStep("result");
    }
  };

  const resetQuiz = () => {
    setCurrentStep("landing");
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
  };

  const score = userAnswers.filter(a => a.isCorrect).length;

  const getEncouragement = (score: number, total: number) => {
    const ratio = score / total;
    if (ratio === 1) return "Perfect! You're a grammar master! 🌟";
    if (ratio >= 0.8) return "Excellent work! Almost there! 🚀";
    if (ratio >= 0.6) return "Good job! Keep practicing! 👍";
    return "Don't give up! Every mistake is a learning opportunity. 💪";
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetQuiz}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">GrammarMaster</h1>
          </div>
          {currentStep === "quiz" && (
            <div className="text-sm font-medium text-slate-500">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {currentStep === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Master English <span className="text-indigo-600">Complex Sentences</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Interactive practice designed for junior high students to sharpen their grammar skills through context-aware exercises.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                    <Filter size={20} />
                    <span>Filter by Difficulty</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["All", ...Object.values(Difficulty)].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDifficulty(d as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedDifficulty === d
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                    <BookOpen size={20} />
                    <span>Grammar Category</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["All", ...Object.values(GrammarPoint)].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCategory(c as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === c
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={startQuiz}
                  disabled={filteredQuestions.length === 0}
                  className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Start Practice
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-sm text-slate-400">
                  {filteredQuestions.length} questions available based on your filters
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === "quiz" && currentQuestion && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                      {currentQuestion.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <span className={`w-2 h-2 rounded-full ${
                        currentQuestion.difficulty === Difficulty.Beginner ? "bg-emerald-400" :
                        currentQuestion.difficulty === Difficulty.Intermediate ? "bg-amber-400" : "bg-rose-400"
                      }`} />
                      {currentQuestion.difficulty}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-slate-300">
                    {currentQuestionIndex + 1}
                  </div>
                </div>

                <div className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-800">
                  {currentQuestion.sentence.split("______").map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className={`inline-block min-w-[120px] border-b-2 mx-2 text-center transition-all ${
                          showExplanation 
                            ? (tempSelectedIndex === currentQuestion.correctIndex ? "text-emerald-600 border-emerald-600" : "text-rose-600 border-rose-600")
                            : (tempSelectedIndex !== null ? "text-indigo-600 border-indigo-600" : "text-slate-300 border-slate-300")
                        }`}>
                          {tempSelectedIndex !== null ? currentQuestion.options[tempSelectedIndex] : "________"}
                        </span>
                      )}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = tempSelectedIndex === index;
                    const isCorrect = index === currentQuestion.correctIndex;
                    
                    let buttonClass = "p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center ";
                    
                    if (showExplanation) {
                      if (isCorrect) {
                        buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-700";
                      } else if (isSelected) {
                        buttonClass += "bg-rose-50 border-rose-500 text-rose-700";
                      } else {
                        buttonClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-50";
                      }
                    } else {
                      if (isSelected) {
                        buttonClass += "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md";
                      } else {
                        buttonClass += "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50";
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        disabled={showExplanation}
                        className={buttonClass}
                      >
                        <span>{option}</span>
                        {showExplanation && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                        {showExplanation && isSelected && !isCorrect && <XCircle size={20} className="text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  {!showExplanation ? (
                    <button
                      onClick={handleSubmit}
                      disabled={tempSelectedIndex === null}
                      className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-30"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      {currentQuestionIndex < filteredQuestions.length - 1 ? "Next Question" : "View Results"}
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6"
                  >
                    <div className="flex items-center gap-3 text-indigo-600">
                      <Info size={24} />
                      <h3 className="text-xl font-bold">Detailed Explanation</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Grammar Rule</h4>
                          <p className="text-slate-700 leading-relaxed">{currentQuestion.explanation.rule}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Example</h4>
                          <p className="text-slate-700 italic">"{currentQuestion.explanation.example}"</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Common Mistake</h4>
                          <p className="text-rose-700 text-sm">{currentQuestion.explanation.commonMistake}</p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Learning Tip</h4>
                          <p className="text-indigo-700 text-sm">Review <a href="#" className="underline font-medium">this grammar point</a> for more details.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {currentStep === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center space-y-8 py-12"
            >
              <div className="relative inline-block">
                <div className="w-48 h-48 rounded-full border-8 border-indigo-100 flex flex-col items-center justify-center bg-white shadow-2xl">
                  <Trophy size={48} className="text-amber-400 mb-2" />
                  <div className="text-4xl font-black text-slate-800">{score}/{filteredQuestions.length}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score</div>
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg"
                >
                  <CheckCircle2 size={24} />
                </motion.div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900">
                  {getEncouragement(score, filteredQuestions.length)}
                </h2>
                <p className="text-slate-600">
                  You've completed the practice session. Review your performance and try again to improve!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={startQuiz}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Try Again
                </button>
                <button
                  onClick={resetQuiz}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Back to Filters
                </button>
              </div>

              <div className="pt-8 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recommended for you</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="#" className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-indigo-300 transition-all group">
                    <div className="text-indigo-600 font-bold mb-1 group-hover:underline">Relative Clauses Guide</div>
                    <div className="text-xs text-slate-500">Master who, which, that and more.</div>
                  </a>
                  <a href="#" className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-indigo-300 transition-all group">
                    <div className="text-indigo-600 font-bold mb-1 group-hover:underline">Non-finite Verbs Video</div>
                    <div className="text-xs text-slate-500">Visual explanation of participles.</div>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© 2026 GrammarMaster. Designed for Junior High Education.</p>
      </footer>
    </div>
  );
}
