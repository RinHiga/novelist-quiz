import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    id: 1,
    text: "電車の中で隣の人の会話が聞こえてきた。あなたは？",
    options: [
      { text: "勝手にその人たちの人生の背景を想像し始める", score: [3, 0, 3, 1, 3] },
      { text: "面白いフレーズがあればこっそりメモする", score: [2, 2, 2, 0, 1] },
      { text: "イヤホンをして自分の世界に入る", score: [1, 1, 0, 2, 2] },
      { text: "特に気にしない", score: [0, 1, 0, 0, 0] },
    ],
  },
  {
    id: 2,
    text: "深夜3時、突然すごいアイデアが浮かんだ。どうする？",
    options: [
      { text: "飛び起きてスマホにメモする", score: [3, 1, 1, 2, 2] },
      { text: "朝起きたら覚えてるだろうと思って寝る（覚えてない）", score: [1, 0, 0, 1, 2] },
      { text: "そのまま興奮して朝まで構想を練る", score: [2, 2, 1, 3, 3] },
      { text: "深夜にアイデアが浮かぶことはない", score: [0, 1, 1, 0, 0] },
    ],
  },
  {
    id: 3,
    text: "友達に「最近どう？」と聞かれた。あなたの頭の中は？",
    options: [
      { text: "回答を3パターンくらいシミュレーションしてから話す", score: [1, 3, 2, 0, 1] },
      { text: "気づいたら自分の話を盛って話している", score: [2, 0, 1, 2, 3] },
      { text: "相手の表情を観察しながら答えを選んでいる", score: [1, 2, 3, 1, 1] },
      { text: "「普通だよ」で終わる", score: [0, 0, 0, 0, 0] },
    ],
  },
  {
    id: 4,
    text: "好きな本の読み方は？",
    options: [
      { text: "一気読み。途中で止められない", score: [3, 0, 1, 3, 2] },
      { text: "構成や伏線を分析しながらじっくり読む", score: [1, 3, 1, 0, 0] },
      { text: "登場人物に感情移入しすぎて疲れる", score: [2, 1, 2, 3, 2] },
      { text: "あまり本は読まない", score: [0, 0, 0, 0, 1] },
    ],
  },
  {
    id: 5,
    text: "シャワーを浴びているとき、何を考えている？",
    options: [
      { text: "存在しない誰かとの架空の会話", score: [2, 0, 1, 2, 3] },
      { text: "今日あった出来事の「もしも」バージョン", score: [2, 1, 2, 1, 3] },
      { text: "明日のタスク整理", score: [0, 2, 0, 0, 0] },
      { text: "無", score: [0, 0, 0, 0, 0] },
    ],
  },
  {
    id: 6,
    text: "誰かの嘘に気づいたとき、最初に思うことは？",
    options: [
      { text: "「なぜこの人は嘘をつく必要があったんだろう」と動機を考える", score: [2, 2, 3, 1, 1] },
      { text: "「この嘘の完成度は何点だろう」と評価する", score: [1, 3, 2, 0, 2] },
      { text: "感情的になって問い詰めたくなる", score: [1, 0, 1, 3, 0] },
      { text: "スルーする", score: [0, 0, 0, 0, 0] },
    ],
  },
  {
    id: 7,
    text: "「あなたの人生を一言で表すと？」と聞かれたら？",
    options: [
      { text: "すぐに気の利いたフレーズが浮かぶ", score: [3, 1, 1, 1, 2] },
      { text: "一言では表せないと思う。人生は複雑だ", score: [2, 2, 2, 2, 1] },
      { text: "面白い回答を考えようとして沈黙する", score: [1, 1, 0, 1, 2] },
      { text: "「普通」", score: [0, 0, 0, 0, 0] },
    ],
  },
  {
    id: 8,
    text: "子供の頃、よくやっていたことは？",
    options: [
      { text: "空想の世界で冒険していた", score: [3, 0, 0, 2, 3] },
      { text: "日記や作文を書くのが好きだった", score: [2, 2, 1, 2, 1] },
      { text: "人の行動をよく観察していた", score: [1, 2, 3, 0, 1] },
      { text: "外で遊ぶのが好きだった", score: [0, 0, 0, 1, 0] },
    ],
  },
  {
    id: 9,
    text: "映画やドラマを観ていて、つい考えてしまうことは？",
    options: [
      { text: "「自分ならこの脚本をこう書き換える」", score: [3, 2, 1, 1, 2] },
      { text: "「このキャラの過去には何があったんだろう」", score: [2, 1, 3, 1, 2] },
      { text: "感情移入しすぎて泣く or 怒る", score: [1, 0, 1, 3, 1] },
      { text: "純粋に楽しんでいる", score: [0, 0, 0, 1, 0] },
    ],
  },
  {
    id: 10,
    text: "SNSに投稿するとき、最も時間をかけるのは？",
    options: [
      { text: "文章の言い回しを何度も推敲する", score: [2, 3, 1, 1, 1] },
      { text: "面白いエピソードを盛って書く", score: [2, 0, 1, 2, 3] },
      { text: "投稿した後に「あの表現のほうがよかった」と後悔する", score: [2, 2, 1, 2, 1] },
      { text: "あまりSNSは使わない or 適当に投稿する", score: [0, 0, 0, 0, 0] },
    ],
  },
  {
    id: 11,
    text: "初対面の人と会ったとき、無意識にしていることは？",
    options: [
      { text: "この人を小説のキャラにしたらどんな設定だろうと考える", score: [3, 1, 2, 0, 3] },
      { text: "話し方や仕草の癖を観察している", score: [1, 2, 3, 0, 1] },
      { text: "相手の感情を敏感に察知している", score: [1, 1, 2, 3, 0] },
      { text: "普通に会話している", score: [0, 0, 0, 0, 0] },
    ],
  },
  {
    id: 12,
    text: "最後の質問。あなたが最も共感する言葉は？",
    options: [
      { text: "「書かずにはいられない」", score: [3, 1, 1, 3, 2] },
      { text: "「物語は人間を理解するための道具だ」", score: [2, 3, 3, 1, 1] },
      { text: "「現実より面白い世界が頭の中にある」", score: [2, 0, 0, 2, 3] },
      { text: "「別にどれもピンとこない」", score: [0, 0, 0, 0, 0] },
    ],
  },
];

// Result types: indices 0-4 are "suited" (~70%), indices 5-6 are "not quite but encouraging"
const RESULTS = [
  {
    type: "天才肌の直感型小説家",
    emoji: "⚡",
    suited: true,
    percentage: 92,
    description:
      "あなたの脳は物語生成マシンです。日常の些細な出来事から壮大なストーリーを紡ぎ出す天性の才能があります。論理より直感、計画より衝動。あなたが書く物語は、読者の予想を裏切る展開で心を掴むでしょう。",
    advice: "考える前に書き始めてください。あなたの直感が最高のプロットを生み出します。",
    writers: "太宰治、カート・ヴォネガット、村田沙耶香",
    color: "#FF6B35",
  },
  {
    type: "緻密な構成型小説家",
    emoji: "🧩",
    suited: true,
    percentage: 87,
    description:
      "あなたは物語の設計図を描ける稀有な人間です。伏線の配置、キャラクターアーク、プロット構造——すべてを計算し尽くした精密な物語を構築できます。ミステリーや壮大なSFが特に向いています。",
    advice: "まずプロットを構造化し、各章の役割を明確にしてから書き始めると真価を発揮します。",
    writers: "宮部みゆき、伊坂幸太郎、アガサ・クリスティ",
    color: "#4ECDC4",
  },
  {
    type: "人間観察の達人型小説家",
    emoji: "👁️",
    suited: true,
    percentage: 89,
    description:
      "あなたは人間という生き物を深く理解しています。表情の微妙な変化、声のトーン、言葉の裏に隠された本音——その洞察力は小説家にとって最強の武器です。リアリティのあるキャラクターを描かせたら右に出る者はいません。",
    advice: "カフェに座って道行く人を観察する時間を作ってください。それがあなたの最高の取材です。",
    writers: "向田邦子、三浦しをん、レイモンド・カーヴァー",
    color: "#9B59B6",
  },
  {
    type: "感情爆発型小説家",
    emoji: "🔥",
    suited: true,
    percentage: 85,
    description:
      "あなたの感受性は常人の3倍です。喜怒哀楽が激しく、その溢れ出る感情こそが読者の心を揺さぶる原動力になります。あなたの書く文章には「体温」があり、読者は思わず涙するでしょう。",
    advice: "感情が高ぶった瞬間にすぐ書き始めてください。その生々しさが最大の武器です。",
    writers: "中原中也、よしもとばなな、ドストエフスキー",
    color: "#E74C3C",
  },
  {
    type: "妄想力全開型小説家",
    emoji: "🌀",
    suited: true,
    percentage: 94,
    description:
      "あなたの頭の中には無限の宇宙が広がっています。現実と空想の境界が曖昧で、常に「もう一つの世界」に片足を突っ込んでいる状態。ファンタジー、SF、不思議な文学——あなたにしか書けない世界があります。",
    advice: "妄想をノートに書き溜めてください。あなたの脳内世界は、そのまま売れる小説のネタです。",
    writers: "星新一、村上春樹、ガブリエル・ガルシア＝マルケス",
    color: "#3498DB",
  },
  {
    type: "潜在能力覚醒待ち型",
    emoji: "🌱",
    suited: false,
    percentage: 45,
    description:
      "現時点では小説家の資質はまだ眠っている段階です。しかし安心してください。多くの偉大な作家も、最初は「自分に才能がある」なんて思っていませんでした。あなたに必要なのは、書き始めるきっかけだけです。",
    advice: "まずは1日5分、思ったことを書く習慣から始めてみてください。才能は書くことで目覚めます。",
    writers: "あなたはまだ見ぬ新しいタイプの作家かもしれません",
    color: "#95A5A6",
  },
  {
    type: "編集者・批評家タイプ",
    emoji: "📝",
    suited: false,
    percentage: 32,
    description:
      "あなたの才能は「書く」ことより「見抜く」ことにあります。作品の良し悪しを的確に判断し、改善点を見つけ出す鋭い目を持っています。小説家より編集者やブックレビュアーとして輝くかもしれません。",
    advice: "もし書くなら、まず大量に読んでから。あなたの分析力は、書く経験と掛け合わせると最強です。",
    writers: "批評家として：小林秀雄、柄谷行人",
    color: "#7F8C8D",
  },
];

function getResult(answers) {
  const scores = [0, 0, 0, 0, 0];
  answers.forEach(({ questionIndex, optionIndex }) => {
    const q = QUESTIONS[questionIndex];
    const option = q.options[optionIndex];
    option.score.forEach((s, i) => {
      scores[i] += s;
    });
  });

  const maxScore = Math.max(...scores);
  const total = scores.reduce((a, b) => a + b, 0);

  // ~70% should get "suited" result
  // Only return non-suited if total score is very low
  if (total <= 8) {
    return RESULTS[6]; // editor type
  }
  if (total <= 14) {
    return RESULTS[5]; // latent potential
  }

  const maxIndex = scores.indexOf(maxScore);
  return RESULTS[maxIndex];
}

function StarField() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            borderRadius: "50%",
            backgroundColor: `rgba(255,255,255,${0.2 + Math.random() * 0.5})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Shippori+Mincho:wght@400;600;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0a0a1a;
    font-family: 'Zen Kaku Gothic New', sans-serif;
    color: #e8e8f0;
    min-height: 100vh;
    overflow-x: hidden;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,107,53,0.3); }
    50% { box-shadow: 0 0 40px rgba(255,107,53,0.6); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes resultReveal {
    0% { opacity: 0; transform: scale(0.8) rotate(-2deg); }
    60% { transform: scale(1.05) rotate(1deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
`;

function IntroScreen({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        animation: "fadeInUp 0.8s ease-out",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          fontSize: "4rem",
          marginBottom: "0.5rem",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        🔮
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          letterSpacing: "6px",
          textTransform: "uppercase",
          color: "#888",
          marginBottom: "1rem",
          fontWeight: 500,
        }}
      >
        Novelist Aptitude Diagnosis
      </div>
      <h1
        style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: "clamp(2rem, 6vw, 3.2rem)",
          fontWeight: 800,
          lineHeight: 1.3,
          marginBottom: "1.5rem",
          background: "linear-gradient(135deg, #FF6B35, #FFD700, #FF6B35)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
        }}
      >
        あなたは
        <br />
        小説家に向いているか
        <br />
        診断
      </h1>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#999",
          maxWidth: "360px",
          lineHeight: 1.8,
          marginBottom: "0.8rem",
        }}
      >
        たった12の質問で、あなたの中に眠る
        <br />
        「物語を紡ぐ才能」を科学的(?)に診断します。
      </p>
      <p
        style={{
          fontSize: "0.72rem",
          color: "#666",
          marginBottom: "2.5rem",
          fontStyle: "italic",
        }}
      >
        ※ 診断時間：約3〜5分 ／ 累計診断数 284,927人（嘘）
      </p>
      <button
        onClick={onStart}
        style={{
          background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
          color: "#fff",
          border: "none",
          padding: "1rem 3rem",
          fontSize: "1.1rem",
          fontWeight: 700,
          borderRadius: "60px",
          cursor: "pointer",
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
          animation: "pulseGlow 2s ease-in-out infinite",
          transition: "transform 0.2s",
          position: "relative",
          zIndex: 2,
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        診断をはじめる →
      </button>
      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          gap: "2rem",
          fontSize: "0.75rem",
          color: "#555",
        }}
      >
        <span>📱 スマホ対応</span>
        <span>⏱️ 約3分</span>
        <span>🔒 データ保存なし</span>
      </div>
    </div>
  );
}

function QuestionScreen({ question, questionIndex, total, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (optionIndex) => {
    if (animating) return;
    setSelected(optionIndex);
    setAnimating(true);
    setTimeout(() => {
      onAnswer(optionIndex);
      setSelected(null);
      setAnimating(false);
    }, 500);
  };

  const progress = ((questionIndex + 1) / total) * 100;

  return (
    <div
      key={question.id}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1.5rem",
        maxWidth: "540px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        animation: "slideIn 0.4s ease-out",
      }}
    >
      {/* Progress */}
      <div style={{ marginBottom: "2rem", marginTop: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            fontSize: "0.75rem",
            color: "#888",
          }}
        >
          <span>
            Q{questionIndex + 1} / {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          style={{
            height: "3px",
            background: "#222",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #FF6B35, #FFD700)",
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h2
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
            fontWeight: 600,
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            color: "#f0f0f5",
          }}
        >
          {question.text}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                background:
                  selected === idx
                    ? "linear-gradient(135deg, rgba(255,107,53,0.3), rgba(255,107,53,0.15))"
                    : "rgba(255,255,255,0.04)",
                border:
                  selected === idx
                    ? "1px solid rgba(255,107,53,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
                padding: "1rem 1.2rem",
                borderRadius: "14px",
                color: selected === idx ? "#FFD700" : "#ccc",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                cursor: "pointer",
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
                textAlign: "left",
                transition: "all 0.3s ease",
                transform: selected === idx ? "scale(1.02)" : "scale(1)",
                animation: `slideIn 0.4s ease-out`,
                animationDelay: `${idx * 0.08}s`,
                animationFillMode: "backwards",
              }}
              onMouseEnter={(e) => {
                if (selected === null) {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.borderColor = "rgba(255,255,255,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (selected === null) {
                  e.target.style.background = "rgba(255,255,255,0.04)";
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                }
              }}
            >
              <span style={{ marginRight: "0.6rem", opacity: 0.4, fontSize: "0.8rem" }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ result, onRetry }) {
  const [shared, setShared] = useState(false);

  const shareText = `🔮 小説家適性診断の結果\n\n${result.emoji} ${result.type}\n（適性度 ${result.percentage}%）\n\n${result.suited ? "小説家の才能があるらしい…！" : "まだ才能は眠っているらしい…"}\n\n▶ あなたも診断してみる`;

  const handleShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    setShared(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1.5rem",
        maxWidth: "540px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div
        style={{
          marginTop: "2rem",
          marginBottom: "1rem",
          fontSize: "0.7rem",
          letterSpacing: "4px",
          color: "#888",
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        ─── DIAGNOSIS RESULT ───
      </div>

      {/* Result Card */}
      <div
        style={{
          background: `linear-gradient(160deg, ${result.color}15, ${result.color}08, rgba(10,10,26,0.9))`,
          border: `1px solid ${result.color}40`,
          borderRadius: "24px",
          padding: "2rem 1.8rem",
          width: "100%",
          animation: "resultReveal 0.8s ease-out",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.8rem" }}>{result.emoji}</div>
          <div
            style={{
              fontSize: "0.7rem",
              color: result.suited ? "#FFD700" : "#999",
              letterSpacing: "2px",
              marginBottom: "0.5rem",
            }}
          >
            {result.suited ? "✨ 小説家適性あり ✨" : "📚 別の才能あり"}
          </div>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: "clamp(1.4rem, 5vw, 1.8rem)",
              fontWeight: 800,
              color: result.color,
              lineHeight: 1.4,
            }}
          >
            {result.type}
          </h2>
        </div>

        {/* Percentage Bar */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              color: "#999",
              marginBottom: "0.4rem",
            }}
          >
            <span>小説家適性度</span>
            <span style={{ color: result.color, fontWeight: 700, fontSize: "1rem" }}>
              {result.percentage}%
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${result.percentage}%`,
                background: `linear-gradient(90deg, ${result.color}, ${result.color}88)`,
                borderRadius: "3px",
                transition: "width 1.5s ease-out",
              }}
            />
          </div>
        </div>

        <p
          style={{
            fontSize: "0.92rem",
            lineHeight: 1.9,
            color: "#ccc",
            marginBottom: "1.5rem",
          }}
        >
          {result.description}
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: "12px",
            padding: "1rem 1.2rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              color: result.color,
              letterSpacing: "2px",
              marginBottom: "0.5rem",
              fontWeight: 700,
            }}
          >
            💡 アドバイス
          </div>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#bbb" }}>{result.advice}</p>
        </div>

        <div
          style={{
            fontSize: "0.78rem",
            color: "#777",
            lineHeight: 1.7,
          }}
        >
          <span style={{ color: "#999" }}>同じタイプの作家：</span>
          {result.writers}
        </div>
      </div>

      {/* Share Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.8rem",
          width: "100%",
          marginBottom: "1rem",
          animation: "fadeInUp 0.8s ease-out 0.3s backwards",
        }}
      >
        <button
          onClick={handleShare}
          style={{
            flex: 1,
            background: "#1DA1F2",
            color: "#fff",
            border: "none",
            padding: "0.9rem",
            borderRadius: "14px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            transition: "transform 0.2s, opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          𝕏 でシェアする
        </button>
        <button
          onClick={handleCopy}
          style={{
            padding: "0.9rem 1.2rem",
            background: "rgba(255,255,255,0.08)",
            color: "#ccc",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "14px",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            transition: "all 0.2s",
          }}
        >
          {shared ? "✓ コピー済" : "📋 コピー"}
        </button>
      </div>

      {/* Retry */}
      <button
        onClick={onRetry}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#888",
          padding: "0.8rem 2rem",
          borderRadius: "60px",
          fontSize: "0.85rem",
          cursor: "pointer",
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
          marginBottom: "2rem",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = "rgba(255,255,255,0.3)";
          e.target.style.color = "#bbb";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = "rgba(255,255,255,0.1)";
          e.target.style.color = "#888";
        }}
      >
        もう一度診断する
      </button>

      <p
        style={{
          fontSize: "0.65rem",
          color: "#444",
          textAlign: "center",
          lineHeight: 1.6,
          maxWidth: "300px",
        }}
      >
        ※ この診断はエンターテインメントです。
        <br />
        科学的根拠はありませんが、あなたの才能は本物です。
      </p>
    </div>
  );
}

export default function NovelistDiagnosis() {
  const [screen, setScreen] = useState("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleStart = () => {
    setScreen("question");
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers, { questionIndex: currentQuestion, optionIndex }];
    setAnswers(newAnswers);

    if (currentQuestion + 1 >= QUESTIONS.length) {
      const r = getResult(newAnswers);
      setResult(r);
      setScreen("result");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleRetry = () => {
    setScreen("intro");
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <>
      <style>{styles}</style>
      <StarField />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        {screen === "intro" && <IntroScreen onStart={handleStart} />}
        {screen === "question" && (
          <QuestionScreen
            question={QUESTIONS[currentQuestion]}
            questionIndex={currentQuestion}
            total={QUESTIONS.length}
            onAnswer={handleAnswer}
          />
        )}
        {screen === "result" && <ResultScreen result={result} onRetry={handleRetry} />}
      </div>
    </>
  );
}
