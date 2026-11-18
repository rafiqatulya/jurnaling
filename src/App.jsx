import React, { useState, useEffect, useMemo, useRef } from 'react';

// ============================================================================
// 1. COLLECTION `mood_messages` (12 MOOD × 10 PESAN PERSONAL = 120 MESSAGES)
// ============================================================================
const MOOD_MESSAGES_COLLECTION = {
  happy: {
    mood: 'happy',
    symbol: '☀️',
    tagline: 'For days when life feels beautiful.',
    theme_color: '#F5D778',
    messages: [
      "You deserve to enjoy the good things without worrying about when they might end.",
      "Let yourself be happy without feeling guilty about it.",
      "You don't have to figure everything out today. Sometimes, being happy is enough.",
      "Remember this feeling. There is still so much beauty waiting for you.",
      "You are allowed to celebrate even the smallest victories.",
      "Don't rush through today. These little moments are part of your life, too.",
      "Happiness doesn't have to be extraordinary to be meaningful.",
      "Let yourself be present instead of worrying about tomorrow.",
      "You have come further than you sometimes give yourself credit for.",
      "I hope you never forget how good it feels to simply be alive."
    ]
  },
  excited: {
    mood: 'excited',
    symbol: '✨',
    tagline: 'For days when you feel full of energy and possibilities.',
    theme_color: '#F2A477',
    messages: [
      "Hold on to that excitement. It might be the beginning of something wonderful.",
      "You don't have to have everything figured out to start something new.",
      "Your curiosity might lead you somewhere you've never imagined.",
      "Let yourself dream bigger than what feels realistic right now.",
      "You are allowed to try, fail, learn, and try again.",
      "Don't let the fear of uncertainty take away your enthusiasm.",
      "Every great journey begins with a little curiosity.",
      "Give your ideas a chance to become something real.",
      "You don't need permission to pursue something that makes you feel alive.",
      "Keep that spark. The world is still full of things waiting for you to discover."
    ]
  },
  in_love: {
    mood: 'in_love',
    symbol: '♡',
    tagline: 'For days when your heart feels warm and full.',
    theme_color: '#D98BAE',
    messages: [
      "It's beautiful to have someone who makes ordinary days feel special.",
      "Let yourself experience love without forgetting to love yourself.",
      "You deserve affection that feels safe, gentle, and consistent.",
      "You don't have to lose yourself to be loved by someone else.",
      "Enjoy the little moments. Sometimes they become the memories you treasure most.",
      "Never mistake uncertainty for the excitement of being loved.",
      "You deserve a love that brings peace, not constant confusion.",
      "Keep your heart open, but never abandon your boundaries.",
      "Love should make room for both people to grow.",
      "Whatever happens, I hope you never stop believing that you deserve genuine love."
    ]
  },
  peaceful: {
    mood: 'peaceful',
    symbol: '☘',
    tagline: 'For days when everything feels calm.',
    theme_color: '#8FB7A0',
    messages: [
      "You don't have to chase something every single day. Rest is part of life, too.",
      "It's okay to enjoy where you are while still wanting more.",
      "You don't have to figure everything out today. Let life unfold at its own pace.",
      "Protect the peace you've worked so hard to find.",
      "Not every problem needs an immediate solution.",
      "There is something beautiful about being comfortable with your own company.",
      "Let today be simple. Not every day needs to be extraordinary.",
      "You are allowed to slow down without feeling left behind.",
      "Sometimes, peace is the greatest achievement.",
      "I hope you learn to create a life you don't constantly need to escape from."
    ]
  },
  sad: {
    mood: 'sad',
    symbol: '☁️',
    tagline: "It's okay to feel blue. For days when your heart feels a little heavier.",
    theme_color: '#83AEDD',
    messages: [
      "You don't have to be okay all the time. Give yourself permission to feel.",
      "You don't have to figure everything out today. Just take it one moment at a time.",
      "It's okay if today wasn't your day. Tomorrow is another opportunity.",
      "Don't be so hard on yourself for things you cannot change.",
      "Your feelings are valid, even when you cannot explain them.",
      "You are not falling behind just because life feels difficult right now.",
      "Some days are simply meant to be survived, not conquered.",
      "Please remember that one difficult chapter does not define your entire story.",
      "You deserve the same kindness you so easily give to other people.",
      "I hope tomorrow feels a little lighter. Until then, be gentle with yourself."
    ]
  },
  lonely: {
    mood: 'lonely',
    symbol: '☾',
    tagline: 'For days when you wish someone understood you.',
    theme_color: '#A99BD6',
    messages: [
      "Being alone doesn't mean you are unworthy of being loved.",
      "You don't have to pretend you're okay just because nobody asked.",
      "There is nothing wrong with wanting someone to stay.",
      "Your existence matters, even on days when nobody seems to notice.",
      "You deserve friendships where you don't always have to be the one reaching out.",
      "Don't let loneliness convince you that you are difficult to love.",
      "It's okay to miss people while learning to live without them.",
      "You can enjoy your own company and still wish for meaningful connections.",
      "The right people won't make you feel like you're asking for too much by simply being yourself.",
      "I hope you find people who make you feel at home, wherever you are."
    ]
  },
  angry: {
    mood: 'angry',
    symbol: '⚡',
    tagline: 'For days when everything feels frustrating.',
    theme_color: '#E58A8E',
    messages: [
      "You are allowed to be angry, but don't let anger decide who you become.",
      "Not everything deserves your energy or reaction.",
      "You don't have to respond to everything immediately.",
      "Sometimes, walking away is more powerful than proving a point.",
      "Your feelings deserve attention, but so does your peace.",
      "Don't let one bad moment ruin the way you see yourself.",
      "It's okay to establish boundaries, even when other people don't understand them.",
      "You can acknowledge your mistakes without hating yourself for them.",
      "Take a breath. You deserve to make decisions with a clear mind.",
      "Let go of what you cannot control, but never abandon what you stand for."
    ]
  },
  overwhelmed: {
    mood: 'overwhelmed',
    symbol: '〰',
    tagline: 'For days when everything feels like too much.',
    theme_color: '#C49A80',
    messages: [
      "You don't have to figure everything out today. One thing at a time is enough.",
      "You are allowed to take a break before you reach your limit.",
      "Not everything on your list needs to be completed today.",
      "You don't need to have your entire future planned to make progress.",
      "It's okay to ask for help instead of carrying everything alone.",
      "Give yourself permission to do less when you need to.",
      "You are a human being, not a machine designed to be productive.",
      "Take a step back. Sometimes clarity comes when you stop rushing.",
      "You can be ambitious and still allow yourself to rest.",
      "Remember, your worth is not measured by how much you accomplish in a day."
    ]
  },
  tired: {
    mood: 'tired',
    symbol: '☕',
    tagline: 'For days when you have nothing left to give.',
    theme_color: '#9BAFC1',
    messages: [
      "You've done enough for today. It's okay to put everything down.",
      "Resting is not wasting time. Your body deserves care, too.",
      "You don't have to earn your right to rest.",
      "Some days, taking care of yourself is the most productive thing you can do.",
      "You don't need to push yourself beyond your limits to prove your strength.",
      "It's okay to postpone things when your body needs recovery.",
      "You are allowed to have unproductive days without feeling guilty.",
      "Tomorrow doesn't need a perfect version of you. It just needs you to show up.",
      "Listen to your body before it has to beg you to slow down.",
      "Close your eyes, breathe, and let yourself have a little peace tonight."
    ]
  },
  neutral: {
    mood: 'neutral',
    symbol: '◌',
    tagline: "For days when you don't feel much of anything.",
    theme_color: '#B8B2A8',
    messages: [
      "Not every day needs to be memorable to be meaningful.",
      "It's okay to feel nothing in particular. You're still living your life.",
      "You don't have to force yourself to feel something just because the day feels ordinary.",
      "Sometimes, an ordinary day is a gift we don't notice.",
      "You don't have to figure everything out today.",
      "Give yourself space to exist without constantly evaluating yourself.",
      "Life is not always exciting, and that's perfectly normal.",
      "Even quiet days are part of your personal growth.",
      "You don't need a reason to slow down and simply be.",
      "Let today be what it is. There's no need to make it more than that."
    ]
  },
  hopeful: {
    mood: 'hopeful',
    symbol: '☀',
    tagline: 'For days when you believe something good is coming.',
    theme_color: '#D9B77B',
    messages: [
      "Keep believing in the life you're slowly building.",
      "Your dreams are worth working towards, even when the destination feels far away.",
      "You don't need to know exactly how everything will happen.",
      "One day, you might look back and realize that these little steps changed everything.",
      "Give your future self something to thank you for.",
      "Don't let temporary circumstances convince you to abandon permanent dreams.",
      "You are allowed to want more from life.",
      "Trust the process, but remember to participate in it.",
      "There is still time to become the person you've always imagined.",
      "I hope you never lose the courage to believe in better days."
    ]
  },
  anxious: {
    mood: 'anxious',
    symbol: '☂',
    tagline: "For days when your mind won't stop worrying.",
    theme_color: '#B09BC1',
    messages: [
      "You don't have to solve every possible problem before it happens.",
      "Not everything you fear is something that will actually happen.",
      "You are allowed to take things one step at a time.",
      "Breathe. You are here, and you only need to focus on this moment.",
      "You don't have to figure everything out today.",
      "Uncertainty is uncomfortable, but it doesn't always mean something bad is coming.",
      "You are allowed to make mistakes and still have a good future.",
      "Be patient with yourself. Healing your worries takes time.",
      "You cannot control every outcome, but you can choose how gently you treat yourself.",
      "I hope you learn to trust yourself, even when life feels uncertain."
    ]
  }
};

// ============================================================================
// 2. DATA 12 KATEGORI MOOD & PALET WARNA
// ============================================================================
const MOODS = [
  {
    id: 'happy',
    name: 'Happy',
    petName: 'SUNNY CORGI',
    colorName: 'Butter yellow',
    hex: '#F5D778',
    softBg: '#FFFBEF',
    cardBg: '#FDF1C8',
    pillBg: '#FCE8A6',
    darkText: '#5C4308',
    accent: '#D49B1A',
    energyScore: 90,
    animalType: 'corgi'
  },
  {
    id: 'excited',
    name: 'Excited',
    petName: 'PEACHY FOX',
    colorName: 'Peach orange',
    hex: '#F2A477',
    softBg: '#FFF5EF',
    cardBg: '#FDE2D2',
    pillBg: '#FBD2BA',
    darkText: '#61290A',
    accent: '#D96B2B',
    energyScore: 95,
    animalType: 'fox'
  },
  {
    id: 'in_love',
    name: 'In Love',
    petName: 'UNI UNICORN',
    colorName: 'Dusty pink',
    hex: '#D98BAE',
    softBg: '#FCF2F7',
    cardBg: '#F6DCE8',
    pillBg: '#EFC9DB',
    darkText: '#591C39',
    accent: '#B85683',
    energyScore: 88,
    animalType: 'unicorn'
  },
  {
    id: 'peaceful',
    name: 'Peaceful',
    petName: 'DINO SAGE',
    colorName: 'Sage green',
    hex: '#8FB7A0',
    softBg: '#F2F8F4',
    cardBg: '#D9ECE1',
    pillBg: '#C6E2D2',
    darkText: '#1E4631',
    accent: '#4E8768',
    energyScore: 82,
    animalType: 'dino'
  },
  {
    id: 'sad',
    name: 'Sad',
    petName: 'BLUEY BUNNY',
    colorName: 'Soft blue',
    hex: '#83AEDD',
    softBg: '#F1F6FC',
    cardBg: '#D8E7F7',
    pillBg: '#C4DBF3',
    darkText: '#1A3B5C',
    accent: '#497FB8',
    energyScore: 38,
    animalType: 'bunny'
  },
  {
    id: 'lonely',
    name: 'Lonely',
    petName: 'LUNA KITTY',
    colorName: 'Lavender',
    hex: '#A99BD6',
    softBg: '#F5F3FB',
    cardBg: '#E4DFF4',
    pillBg: '#D4CCF0',
    darkText: '#32255E',
    accent: '#7360B5',
    energyScore: 42,
    animalType: 'kitty'
  },
  {
    id: 'angry',
    name: 'Angry',
    petName: 'PUFFY RED PANDA',
    colorName: 'Soft red',
    hex: '#E58A8E',
    softBg: '#FDF2F3',
    cardBg: '#F9DADC',
    pillBg: '#F4C5C8',
    darkText: '#611B1F',
    accent: '#C45459',
    energyScore: 45,
    animalType: 'redpanda'
  },
  {
    id: 'overwhelmed',
    name: 'Overwhelmed',
    petName: 'MOCHA OTTER',
    colorName: 'Warm taupe',
    hex: '#C49A80',
    softBg: '#FAF5F1',
    cardBg: '#EFE2D8',
    pillBg: '#E4D0C2',
    darkText: '#4F301D',
    accent: '#9C6B4E',
    energyScore: 35,
    animalType: 'otter'
  },
  {
    id: 'tired',
    name: 'Tired',
    petName: 'SLEEPY KOALA',
    colorName: 'Dusty blue-grey',
    hex: '#9BAFC1',
    softBg: '#F3F6F9',
    cardBg: '#DEE6EE',
    pillBg: '#CDD9E5',
    darkText: '#283A4A',
    accent: '#647F96',
    energyScore: 30,
    animalType: 'koala'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    petName: 'MOCHI CAPYBARA',
    colorName: 'Warm grey',
    hex: '#B8B2A8',
    softBg: '#F6F5F3',
    cardBg: '#E8E5E0',
    pillBg: '#DAD5CE',
    darkText: '#3D3932',
    accent: '#857E73',
    energyScore: 65,
    animalType: 'capybara'
  },
  {
    id: 'hopeful',
    name: 'Hopeful',
    petName: 'GOLDIE DUCK',
    colorName: 'Warm gold',
    hex: '#D9B77B',
    softBg: '#FBF7F0',
    cardBg: '#F4E8D1',
    pillBg: '#EBD9B7',
    darkText: '#543A10',
    accent: '#B3863B',
    energyScore: 86,
    animalType: 'duck'
  },
  {
    id: 'anxious',
    name: 'Anxious',
    petName: 'BERRY HEDGEHOG',
    colorName: 'Muted purple',
    hex: '#B09BC1',
    softBg: '#F7F4F9',
    cardBg: '#E8DFEE',
    pillBg: '#DACCE4',
    darkText: '#3F2A4F',
    accent: '#836799',
    energyScore: 40,
    animalType: 'hedgehog'
  }
];

const MONTHS_INFO = [
  { num: 1, short: 'Jan', full: 'Januari', days: 31 },
  { num: 2, short: 'Feb', full: 'Februari', days: 28 },
  { num: 3, short: 'Mar', full: 'Maret', days: 31 },
  { num: 4, short: 'Apr', full: 'April', days: 30 },
  { num: 5, short: 'Mei', full: 'Mei', days: 31 },
  { num: 6, short: 'Jun', full: 'Juni', days: 30 },
  { num: 7, short: 'Jul', full: 'Juli', days: 31 },
  { num: 8, short: 'Agu', full: 'Agustus', days: 31 },
  { num: 9, short: 'Sep', full: 'September', days: 30 },
  { num: 10, short: 'Okt', full: 'Oktober', days: 31 },
  { num: 11, short: 'Nov', full: 'November', days: 30 },
  { num: 12, short: 'Des', full: 'Desember', days: 31 }
];

// ============================================================================
// 3. ILUSTRASI BINATANG 3D CLAY LUCU (REACT COMPONENT)
// ============================================================================
function getCuteAnimalSVG(type, sizeClass = 'w-full h-full') {
  const defs = `
    <defs>
      <radialGradient id="clayShine" cx="35%" cy="25%" r="65%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.65"/>
        <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
      </radialGradient>
      <filter id="softDrop" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.16"/>
      </filter>
    </defs>
  `;

  const templates = {
    unicorn: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <ellipse cx="46" cy="40" rx="10" ry="16" transform="rotate(-18 46 40)" fill="#FFF5F8"/>
          <ellipse cx="46" cy="41" rx="5" ry="10" transform="rotate(-18 46 41)" fill="#F4A2C0"/>
          <ellipse cx="94" cy="40" rx="10" ry="16" transform="rotate(18 94 40)" fill="#FFF5F8"/>
          <ellipse cx="94" cy="41" rx="5" ry="10" transform="rotate(18 94 41)" fill="#F4A2C0"/>
          <path d="M70 11L61 38H79L70 11Z" fill="#FBBF24"/>
          <path d="M64 29H76M66 21H74" stroke="#D97706" stroke-width="2" stroke-linecap="round"/>
          <ellipse cx="70" cy="96" rx="34" ry="30" fill="#FFFFFF"/>
          <ellipse cx="70" cy="96" rx="34" ry="30" fill="url(#clayShine)"/>
          <rect x="38" y="34" width="64" height="56" rx="28" fill="#FFFFFF"/>
          <rect x="38" y="34" width="64" height="56" rx="28" fill="url(#clayShine)"/>
          <ellipse cx="70" cy="68" rx="20" ry="13" fill="#FAD2E4"/>
          <circle cx="63" cy="67" r="2.2" fill="#9D4B6D"/>
          <circle cx="77" cy="67" r="2.2" fill="#9D4B6D"/>
          <circle cx="54" cy="52" r="4.2" fill="#1E293B"/>
          <circle cx="52.8" cy="50.5" r="1.5" fill="#FFFFFF"/>
          <circle cx="86" cy="52" r="4.2" fill="#1E293B"/>
          <circle cx="84.8" cy="50.5" r="1.5" fill="#FFFFFF"/>
          <ellipse cx="42" cy="96" rx="8" ry="12" transform="rotate(20 42 96)" fill="#F4A2C0"/>
          <ellipse cx="98" cy="96" rx="8" ry="12" transform="rotate(-20 98 96)" fill="#F4A2C0"/>
          <ellipse cx="55" cy="122" rx="10" ry="7" fill="#F4A2C0"/>
          <ellipse cx="85" cy="122" rx="10" ry="7" fill="#F4A2C0"/>
        </g>
      </svg>
    `,
    corgi: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <path d="M35 22C29 24 28 45 36 54L56 42C50 28 41 20 35 22Z" fill="#F59E0B"/>
          <path d="M105 22C111 24 112 45 104 54L84 42C90 28 99 20 105 22Z" fill="#F59E0B"/>
          <path d="M38 29C35 31 35 43 40 49L51 41C47 33 41 28 38 29Z" fill="#FDE68A"/>
          <path d="M102 29C105 31 105 43 100 49L89 41C93 33 99 28 102 29Z" fill="#FDE68A"/>
          <ellipse cx="70" cy="96" rx="34" ry="29" fill="#F59E0B"/>
          <ellipse cx="70" cy="98" rx="22" ry="23" fill="#FFFBEB"/>
          <rect x="36" y="36" width="68" height="54" rx="27" fill="#F59E0B"/>
          <rect x="36" y="36" width="68" height="54" rx="27" fill="url(#clayShine)"/>
          <ellipse cx="70" cy="69" rx="22" ry="15" fill="#FFFBEB"/>
          <rect x="65" y="42" width="10" height="22" rx="5" fill="#FFFBEB"/>
          <ellipse cx="70" cy="64" rx="5.5" ry="4" fill="#1E293B"/>
          <path d="M65 71Q70 76 75 71" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="52" cy="55" r="4.5" fill="#1E293B"/>
          <circle cx="50.5" cy="53.5" r="1.6" fill="#FFFFFF"/>
          <circle cx="88" cy="55" r="4.5" fill="#1E293B"/>
          <circle cx="86.5" cy="53.5" r="1.6" fill="#FFFFFF"/>
          <rect x="46" y="84" width="48" height="7" rx="3.5" fill="#EF4444"/>
          <circle cx="70" cy="91" r="6" fill="#FBBF24" stroke="#B45309" stroke-width="1.5"/>
        </g>
      </svg>
    `,
    dino: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <circle cx="70" cy="24" r="7" fill="#FBBF24"/>
          <circle cx="84" cy="29" r="6" fill="#FBBF24"/>
          <circle cx="95" cy="40" r="5.5" fill="#FBBF24"/>
          <ellipse cx="70" cy="96" rx="33" ry="29" fill="#84CC16"/>
          <ellipse cx="67" cy="98" rx="21" ry="21" fill="#DCFCE7"/>
          <rect x="37" y="30" width="64" height="56" rx="28" fill="#84CC16"/>
          <rect x="37" y="30" width="64" height="56" rx="28" fill="url(#clayShine)"/>
          <rect x="43" y="64" width="52" height="20" rx="10" fill="#A3E635"/>
          <path d="M54 64V60L58 64M82 64V60L86 64" fill="#FFFFFF"/>
          <circle cx="54" cy="48" r="6" fill="#FFFFFF"/>
          <circle cx="55" cy="48" r="3.2" fill="#1E293B"/>
          <circle cx="82" cy="48" r="6" fill="#FFFFFF"/>
          <circle cx="81" cy="48" r="3.2" fill="#1E293B"/>
          <ellipse cx="46" cy="58" rx="5" ry="3" fill="#F472B6" fill-opacity="0.5"/>
          <ellipse cx="90" cy="58" rx="5" ry="3" fill="#F472B6" fill-opacity="0.5"/>
        </g>
      </svg>
    `,
    fox: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <path d="M34 24L42 54L62 38Z" fill="#FB923C"/>
          <path d="M106 24L98 54L78 38Z" fill="#FB923C"/>
          <ellipse cx="70" cy="96" rx="32" ry="28" fill="#FB923C"/>
          <ellipse cx="70" cy="98" rx="20" ry="21" fill="#FFF7ED"/>
          <rect x="36" y="36" width="68" height="52" rx="26" fill="#FB923C"/>
          <rect x="36" y="36" width="68" height="52" rx="26" fill="url(#clayShine)"/>
          <ellipse cx="70" cy="70" rx="24" ry="15" fill="#FFF7ED"/>
          <circle cx="53" cy="55" r="4.3" fill="#1E293B"/>
          <circle cx="87" cy="55" r="4.3" fill="#1E293B"/>
          <circle cx="70" cy="65" r="4.5" fill="#1E293B"/>
          <path d="M64 73Q70 78 76 73" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round"/>
        </g>
      </svg>
    `,
    bunny: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <ellipse cx="54" cy="28" rx="9" ry="22" fill="#BFDBFE"/>
          <ellipse cx="54" cy="29" rx="4.5" ry="15" fill="#F4A2C0"/>
          <ellipse cx="86" cy="28" rx="9" ry="22" fill="#BFDBFE"/>
          <ellipse cx="86" cy="29" rx="4.5" ry="15" fill="#F4A2C0"/>
          <ellipse cx="70" cy="97" rx="31" ry="27" fill="#DBEAFE"/>
          <rect x="38" y="42" width="64" height="50" rx="25" fill="#DBEAFE"/>
          <rect x="38" y="42" width="64" height="50" rx="25" fill="url(#clayShine)"/>
          <circle cx="54" cy="63" r="4.2" fill="#1E3A8A"/>
          <circle cx="86" cy="63" r="4.2" fill="#1E3A8A"/>
          <ellipse cx="70" cy="68" rx="4" ry="3" fill="#F472B6"/>
          <path d="M65 75Q70 71 75 75" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="48" cy="70" r="4" fill="#60A5FA" fill-opacity="0.6"/>
        </g>
      </svg>
    `,
    kitty: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <path d="M38 30L42 56L62 42Z" fill="#C4B5FD"/>
          <path d="M102 30L98 56L78 42Z" fill="#C4B5FD"/>
          <ellipse cx="70" cy="96" rx="31" ry="27" fill="#DDD6FE"/>
          <rect x="38" y="40" width="64" height="50" rx="25" fill="#DDD6FE"/>
          <rect x="38" y="40" width="64" height="50" rx="25" fill="url(#clayShine)"/>
          <circle cx="54" cy="62" r="4.2" fill="#312E81"/>
          <circle cx="86" cy="62" r="4.2" fill="#312E81"/>
          <ellipse cx="70" cy="67" rx="3.8" ry="2.8" fill="#F472B6"/>
          <path d="M64 73Q70 76 76 73" stroke="#312E81" stroke-width="2" stroke-linecap="round"/>
          <path d="M67 47C67 44 71 43 73 46C70 46 69 49 72 51C69 51 67 49 67 47Z" fill="#FBBF24"/>
        </g>
      </svg>
    `,
    redpanda: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <circle cx="44" cy="40" r="12" fill="#FDA4AF"/>
          <circle cx="96" cy="40" r="12" fill="#FDA4AF"/>
          <ellipse cx="70" cy="96" rx="32" ry="27" fill="#F43F5E"/>
          <rect x="36" y="38" width="68" height="52" rx="26" fill="#FB7185"/>
          <rect x="36" y="38" width="68" height="52" rx="26" fill="url(#clayShine)"/>
          <ellipse cx="53" cy="62" rx="10" ry="8" fill="#FFF1F2"/>
          <ellipse cx="87" cy="62" rx="10" ry="8" fill="#FFF1F2"/>
          <path d="M46 52L58 56M94 52L82 56" stroke="#881337" stroke-width="3" stroke-linecap="round"/>
          <circle cx="54" cy="61" r="4" fill="#881337"/>
          <circle cx="86" cy="61" r="4" fill="#881337"/>
          <ellipse cx="70" cy="69" rx="14" ry="10" fill="#FFF1F2"/>
          <circle cx="70" cy="66" r="3.8" fill="#881337"/>
        </g>
      </svg>
    `,
    otter: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <circle cx="42" cy="46" r="9" fill="#A87C5F"/>
          <circle cx="98" cy="46" r="9" fill="#A87C5F"/>
          <ellipse cx="70" cy="96" rx="32" ry="28" fill="#B98B6D"/>
          <ellipse cx="70" cy="98" rx="20" ry="21" fill="#F5EBE1"/>
          <rect x="38" y="38" width="64" height="52" rx="26" fill="#C49A80"/>
          <rect x="38" y="38" width="64" height="52" rx="26" fill="url(#clayShine)"/>
          <ellipse cx="70" cy="68" rx="20" ry="12" fill="#F5EBE1"/>
          <circle cx="54" cy="55" r="4" fill="#291D16"/>
          <circle cx="86" cy="55" r="4" fill="#291D16"/>
          <ellipse cx="70" cy="64" rx="5" ry="3.5" fill="#432818"/>
          <path d="M62 73C65 71 68 75 70 73C72 71 75 75 78 73" stroke="#432818" stroke-width="2" stroke-linecap="round"/>
        </g>
      </svg>
    `,
    koala: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <circle cx="36" cy="50" r="15" fill="#94A3B8"/>
          <circle cx="36" cy="50" r="9" fill="#E2E8F0"/>
          <circle cx="104" cy="50" r="15" fill="#94A3B8"/>
          <circle cx="104" cy="50" r="9" fill="#E2E8F0"/>
          <ellipse cx="70" cy="96" rx="31" ry="27" fill="#94A3B8"/>
          <ellipse cx="70" cy="98" rx="19" ry="20" fill="#F1F5F9"/>
          <rect x="38" y="38" width="64" height="52" rx="26" fill="#CBD5E1"/>
          <rect x="38" y="38" width="64" height="52" rx="26" fill="url(#clayShine)"/>
          <ellipse cx="70" cy="64" rx="8" ry="11" fill="#334155"/>
          <path d="M48 56Q54 61 60 56M80 56Q86 61 92 56" stroke="#334155" stroke-width="2.4" stroke-linecap="round"/>
        </g>
      </svg>
    `,
    capybara: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <circle cx="70" cy="29" r="8" fill="#FB923C"/>
          <path d="M70 21C72 18 76 19 75 22" stroke="#16A34A" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="45" cy="42" r="8" fill="#8C7A6B"/>
          <circle cx="95" cy="42" r="8" fill="#8C7A6B"/>
          <ellipse cx="70" cy="96" rx="33" ry="28" fill="#A89888"/>
          <rect x="37" y="36" width="66" height="54" rx="27" fill="#B8A99A"/>
          <rect x="37" y="36" width="66" height="54" rx="27" fill="url(#clayShine)"/>
          <ellipse cx="70" cy="67" rx="21" ry="14" fill="#9A8978"/>
          <line x1="49" y1="54" x2="58" y2="54" stroke="#27272A" stroke-width="2.6" stroke-linecap="round"/>
          <line x1="82" y1="54" x2="91" y2="54" stroke="#27272A" stroke-width="2.6" stroke-linecap="round"/>
          <circle cx="64" cy="64" r="2.2" fill="#27272A"/>
          <circle cx="76" cy="64" r="2.2" fill="#27272A"/>
        </g>
      </svg>
    `,
    duck: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <path d="M68 24C64 17 73 15 74 24" stroke="#FBBF24" stroke-width="4" stroke-linecap="round"/>
          <ellipse cx="70" cy="96" rx="33" ry="28" fill="#FDE68A"/>
          <rect x="39" y="36" width="62" height="52" rx="26" fill="#FEF08A"/>
          <rect x="39" y="36" width="62" height="52" rx="26" fill="url(#clayShine)"/>
          <ellipse cx="70" cy="66" rx="16" ry="8" fill="#FB923C"/>
          <circle cx="54" cy="54" r="4.2" fill="#1E293B"/>
          <circle cx="86" cy="54" r="4.2" fill="#1E293B"/>
          <ellipse cx="47" cy="63" rx="5" ry="3" fill="#F472B6" fill-opacity="0.55"/>
          <ellipse cx="93" cy="63" rx="5" ry="3" fill="#F472B6" fill-opacity="0.55"/>
        </g>
      </svg>
    `,
    hedgehog: `
      <svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">
        ${defs}
        <g filter="url(#softDrop)">
          <circle cx="70" cy="64" r="39" fill="#9378B0"/>
          <ellipse cx="70" cy="97" rx="30" ry="26" fill="#E9D5FF"/>
          <rect x="41" y="42" width="58" height="48" rx="24" fill="#F3E8FF"/>
          <rect x="41" y="42" width="58" height="48" rx="24" fill="url(#clayShine)"/>
          <circle cx="55" cy="62" r="4.2" fill="#3B0764"/>
          <circle cx="85" cy="62" r="4.2" fill="#3B0764"/>
          <circle cx="70" cy="67" r="4" fill="#581C87"/>
          <path d="M64 74Q70 71 76 74" stroke="#581C87" stroke-width="2" stroke-linecap="round"/>
        </g>
      </svg>
    `
  };

  return templates[type] || templates.unicorn;
}

function CuteAnimal({ type, sizeClass = 'w-full h-full' }) {
  return (
    <div
      className={sizeClass}
      dangerouslySetInnerHTML={{ __html: getCuteAnimalSVG(type, 'w-full h-full') }}
    />
  );
}

// ============================================================================
// 4. INITIAL RIWAYAT JURNAL LYA (DENGAN KUNCI TANGGAL `YYYY-MM-DD`)
// ============================================================================
const INITIAL_JOURNALS = {
  '2026-11-02': {
    year: 2026,
    month: 11,
    day: 2,
    dateStr: '2026-11-02',
    moodId: 'happy',
    guided: {
      q1: 'Senang dan produktif menyelesaikan tugas hari ini.',
      q2: 'Ngobrol santai sambil mulai tertarik bikin personal coding project.',
      q3: 'Masih suka menunda pekerjaan ketika sore mulai lelah.',
      q4: 'Bersyukur punya teman diskusi yang suportif.',
      q5: 'Belajar desain UI mobile yang clean.',
      q6: 'Latihan Pilates 2 kali seminggu dan journaling.',
      q7: 'Melanjutkan pendidikan S2 di bidang Business Technology.',
      q8: 'Merapikan ide aplikasi di GitHub selama 30 menit.'
    },
    freeText: '',
    daily_insights: {
      self_reflection: {
        summary: 'Mood Happy: Senang dan produktif menyelesaikan tugas hari ini.',
        strengths: ['Ngobrol santai sambil mulai personal coding project', 'Mensyukuri: Teman diskusi yang suportif', 'Belajar: Desain UI mobile yang clean'],
        areas_to_improve: ['Menunda pekerjaan ketika sore mulai lelah']
      },
      interests_and_hobbies: {
        interests: ['Coding Projects', 'UI/UX Design', 'Pilates', 'Journaling'],
        potential_hobbies: ['Latihan Pilates 2 kali seminggu', 'Journaling']
      },
      future_aspirations: {
        dreams: ['Melanjutkan pendidikan S2 Business Technology'],
        career_goals: ['Karier Business & Technology'],
        life_goals: ['Punya teman diskusi yang suportif']
      },
      personal_growth: {
        lessons_learned: ['Belajar desain UI mobile yang clean'],
        recommended_actions: ['Merapikan ide aplikasi di GitHub 30 menit']
      }
    }
  },
  '2026-11-05': {
    year: 2026,
    month: 11,
    day: 5,
    dateStr: '2026-11-05',
    moodId: 'excited',
    guided: {
      q1: 'Bersemangat merancang fitur untuk jurnal pribadiku.',
      q2: 'Berhasil menyusun konsep Dear Future Me.',
      q3: 'Terlalu banyak ide sekaligus sampai bingung mulai dari mana.',
      q4: 'Bersyukur punya rasa ingin tahu tinggi.',
      q5: 'Belajar pengolahan teks lokal untuk merangkum diary.',
      q6: 'Coding personal projects dan menulis refleksi.',
      q7: 'Karier stabil di Business & Technology dan mandiri finansial.',
      q8: 'Fokus selesaikan 1 layar utama dulu.'
    },
    freeText: '',
    daily_insights: {
      self_reflection: {
        summary: 'Mood Excited: Bersemangat merancang fitur untuk jurnal pribadiku.',
        strengths: ['Berhasil menyusun konsep Dear Future Me', 'Mensyukuri: Rasa ingin tahu tinggi', 'Belajar: Pengolahan teks lokal merangkum diary'],
        areas_to_improve: ['Terlalu banyak ide sekaligus sampai bingung']
      },
      interests_and_hobbies: {
        interests: ['Coding Projects', 'Writing', 'Technology', 'Business'],
        potential_hobbies: ['Coding personal projects', 'Menulis refleksi']
      },
      future_aspirations: {
        dreams: ['Karier stabil di Business & Technology', 'Mandiri finansial'],
        career_goals: ['Karier stabil di Business & Technology'],
        life_goals: ['Mandiri finansial']
      },
      personal_growth: {
        lessons_learned: ['Belajar pengolahan teks lokal untuk merangkum diary'],
        recommended_actions: ['Fokus selesaikan 1 layar utama dulu']
      }
    }
  },
  '2026-11-09': {
    year: 2026,
    month: 11,
    day: 9,
    dateStr: '2026-11-09',
    moodId: 'tired',
    guided: {
      q1: 'Cukup lelah dan kehabisan energi sejak siang.',
      q2: 'Sempat mendengarkan musik tenang sebelum tidur.',
      q3: 'Saat lelah cenderung menarik diri dan menunda aktivitas.',
      q4: 'Bersyukur tubuh memberi sinyal istirahat.',
      q5: 'Membedakan kebutuhan istirahat vs menghindari masalah.',
      q6: 'Pilates dan peregangan malam.',
      q7: 'Hidup seimbang dan mandiri secara finansial.',
      q8: 'Tidur lebih awal dan peregangan 10 menit esok pagi.'
    },
    freeText: '',
    daily_insights: {
      self_reflection: {
        summary: 'Mood Tired: Cukup lelah dan kehabisan energi sejak siang.',
        strengths: ['Sempat mendengarkan musik tenang sebelum tidur', 'Mensyukuri: Tubuh memberi sinyal istirahat'],
        areas_to_improve: ['Saat lelah cenderung menarik diri', 'Menunda aktivitas saat kelelahan']
      },
      interests_and_hobbies: {
        interests: ['Pilates', 'Music', 'Peregangan malam'],
        potential_hobbies: ['Pilates', 'Peregangan malam']
      },
      future_aspirations: {
        dreams: ['Hidup seimbang', 'Mandiri secara finansial'],
        career_goals: ['Mandiri secara finansial'],
        life_goals: ['Hidup seimbang']
      },
      personal_growth: {
        lessons_learned: ['Membedakan kebutuhan istirahat vs menghindari masalah'],
        recommended_actions: ['Tidur lebih awal', 'Peregangan 10 menit esok pagi']
      }
    }
  },
  '2026-11-12': {
    year: 2026,
    month: 11,
    day: 12,
    dateStr: '2026-11-12',
    moodId: 'peaceful',
    guided: {
      q1: 'Tenang dan damai selesai olahraga sore.',
      q2: 'Sesi Pilates bikin badan segar kembali.',
      q3: 'Kepikiran persiapan syarat beasiswa S2.',
      q4: 'Bersyukur kesehatan minggu ini stabil.',
      q5: 'Membaca pengalaman kuliah S2 di luar negeri.',
      q6: 'Pilates, Traveling, dan menulis jurnal.',
      q7: 'S2 Business Technology dan tinggal di luar negeri.',
      q8: 'Mencatat 3 kampus tujuan S2.'
    },
    freeText: '',
    daily_insights: {
      self_reflection: {
        summary: 'Mood Peaceful: Tenang dan damai selesai olahraga sore.',
        strengths: ['Sesi Pilates bikin badan segar kembali', 'Mensyukuri: Kesehatan minggu ini stabil'],
        areas_to_improve: ['Kepikiran persiapan syarat beasiswa S2']
      },
      interests_and_hobbies: {
        interests: ['Pilates', 'Traveling', 'Writing', 'Reading'],
        potential_hobbies: ['Pilates', 'Traveling', 'Menulis jurnal']
      },
      future_aspirations: {
        dreams: ['S2 Business Technology', 'Tinggal di luar negeri'],
        career_goals: ['S2 Business Technology'],
        life_goals: ['Tinggal di luar negeri']
      },
      personal_growth: {
        lessons_learned: ['Membaca pengalaman kuliah S2 di luar negeri'],
        recommended_actions: ['Mencatat 3 kampus tujuan S2']
      }
    }
  },
  '2026-11-15': {
    year: 2026,
    month: 11,
    day: 15,
    dateStr: '2026-11-15',
    moodId: 'hopeful',
    guided: {
      q1: 'Penuh harapan melihat progres belajar bulan ini.',
      q2: 'Menyelesaikan desain aplikasi Dear Future Me.',
      q3: 'Ingin lebih disiplin membagi waktu.',
      q4: 'Bersyukur ide di kepala mulai terwujud.',
      q5: 'Konsistensi kecil mengalahkan motivasi sesaat.',
      q6: 'Coding personal projects, menulis, dan fotografi sore.',
      q7: 'Mandiri finansial, karier Business & Technology, lanjut S2.',
      q8: 'Meluangkan 30 menit lanjut koding aplikasi.'
    },
    freeText: '',
    daily_insights: {
      self_reflection: {
        summary: 'Mood Hopeful: Penuh harapan melihat progres belajar bulan ini.',
        strengths: ['Menyelesaikan desain aplikasi Dear Future Me', 'Mensyukuri: Ide di kepala mulai terwujud'],
        areas_to_improve: ['Ingin lebih disiplin membagi waktu']
      },
      interests_and_hobbies: {
        interests: ['Coding Projects', 'Writing', 'Fotografi', 'UI/UX Design', 'Business', 'Technology'],
        potential_hobbies: ['Coding personal projects', 'Menulis', 'Fotografi sore']
      },
      future_aspirations: {
        dreams: ['Mandiri finansial', 'Karier Business & Technology', 'Lanjut S2'],
        career_goals: ['Karier Business & Technology'],
        life_goals: ['Mandiri finansial']
      },
      personal_growth: {
        lessons_learned: ['Konsistensi kecil mengalahkan motivasi sesaat'],
        recommended_actions: ['Meluangkan 30 menit lanjut koding aplikasi']
      }
    }
  },
  '2026-11-18': {
    year: 2026,
    month: 11,
    day: 18,
    dateStr: '2026-11-18',
    moodId: 'in_love',
    guided: {
      q1: 'Merasa hangat, bersyukur, dan senang merancang jurnal pribadiku.',
      q2: 'Menyelesaikan konsep kartu sambutan A Little Note for You.',
      q3: 'Saat lelah masih suka menunda rencana.',
      q4: 'Bersyukur terus semangat mengenali diri sendiri.',
      q5: 'Memisahkan keinginan sesaat vs cita-cita konsisten.',
      q6: 'Coding personal projects, journaling malam, dan Pilates.',
      q7: 'S2 Business Technology, mandiri finansial, dan bekerja di luar negeri.',
      q8: 'Uji coba aplikasi di HP dan unggah ke GitHub.'
    },
    freeText: '',
    daily_insights: {
      self_reflection: {
        summary: 'Mood In Love: Merasa hangat, bersyukur, dan senang merancang jurnal pribadiku.',
        strengths: ['Menyelesaikan konsep kartu A Little Note for You', 'Mensyukuri: Semangat mengenali diri sendiri'],
        areas_to_improve: ['Saat lelah masih suka menunda rencana']
      },
      interests_and_hobbies: {
        interests: ['Coding Projects', 'Journaling', 'Pilates', 'Technology', 'Business'],
        potential_hobbies: ['Coding personal projects', 'Journaling malam', 'Pilates']
      },
      future_aspirations: {
        dreams: ['S2 Business Technology', 'Mandiri finansial', 'Bekerja di luar negeri'],
        career_goals: ['S2 Business Technology'],
        life_goals: ['Mandiri finansial', 'Bekerja di luar negeri']
      },
      personal_growth: {
        lessons_learned: ['Memisahkan keinginan sesaat vs cita-cita konsisten'],
        recommended_actions: ['Uji coba aplikasi di HP', 'Unggah ke GitHub']
      }
    }
  }
};

// ============================================================================
// 5. ENGINE AI NLP LOKAL 100% OFFLINE (TANPA API & TANPA MENGADA-ADA)
//    Meringkas & Mengekstrak Data Asli dari Teks Input + Memori Sebelumnya
// ============================================================================
const STOPWORDS_ID = new Set([
  'aku', 'saya', 'gue', 'hari', 'ini', 'merasa', 'yang', 'dan', 'di', 'ke', 'dari',
  'untuk', 'dengan', 'karena', 'itu', 'ini', 'ada', 'bisa', 'mau', 'ingin', 'cukup',
  'sangat', 'banget', 'tadi', 'sedikit', 'hal', 'paling', 'menyenangkan', 'adalah',
  'mengganggu', 'pikiranku', 'satu', 'syukuri', 'baru', 'pikirkan', 'pelajari',
  'sesuatu', 'coba', 'jadikan', 'atau', 'besok', 'juga', 'masih', 'suka', 'ketika',
  'saat', 'kalau', 'tapi', 'tetapi', 'namun', 'supaya', 'agar', 'dalam', 'pada',
  'seperti', 'sudah', 'telah', 'akan', 'lagi', 'sama', 'buat', 'jadi', 'lebih'
]);

const POSITIVE_MARKERS = [
  'senang', 'bahagia', 'berhasil', 'selesai', 'tuntas', 'syukur', 'bersyukur',
  'produktif', 'tenang', 'nyaman', 'bangga', 'belajar', 'paham', 'semangat',
  'antusias', 'bisa', 'lancar', 'segar', 'puas', 'hangat', 'bagus', 'baik'
];

const FRICTION_MARKERS = [
  'lelah', 'capek', 'letih', 'tunda', 'menunda', 'bingung', 'cemas', 'khawatir',
  'takut', 'sulit', 'susah', 'malas', 'ganggu', 'mengganggu', 'kepikiran',
  'overthinking', 'belum', 'kurang', 'lambat', 'terlalu', 'stres', 'pusing', 'tarik diri'
];

const FUTURE_MARKERS = [
  'impian', 'cita-cita', 'masa depan', 's2', 'master', 'beasiswa', 'kuliah',
  'karier', 'kerja', 'finansial', 'mandiri', 'luar negeri', 'bangun', 'punya',
  'ingin jadi', 'target', 'visi', 'harap', 'semoga'
];

const ACTION_MARKERS = [
  'besok', 'mulai', 'lanjut', 'fokus', 'coba', 'rapikan', 'kerjakan', 'buat',
  'tulis', 'jadwal', 'tidur', 'olahraga', 'latihan', 'baca', 'riset', 'unggah', 'cek'
];

const HOBBY_TAXONOMY = [
  { kw: ['coding', 'koding', 'github', 'aplikasi', 'project', 'html', 'apk', 'react', 'web', 'program'], label: 'Coding Projects' },
  { kw: ['teknologi', 'tech', 'sistem', 'data', 'ai', 'software'], label: 'Technology' },
  { kw: ['bisnis', 'business', 'manajemen', 'produk', 'strategi'], label: 'Business' },
  { kw: ['pilates', 'yoga', 'stretching', 'peregangan', 'olahraga', 'gym', 'lari', 'workout'], label: 'Pilates & Fitness' },
  { kw: ['tulis', 'menulis', 'writing', 'diary', 'jurnal', 'journaling', 'cerita', 'puisi', 'lirik'], label: 'Journaling & Writing' },
  { kw: ['travel', 'jalan-jalan', 'liburan', 'eksplor'], label: 'Traveling' },
  { kw: ['desain', 'design', 'ui', 'ux', 'figma', 'warna', 'ilustrasi'], label: 'UI/UX Design' },
  { kw: ['musik', 'lagu', 'music', 'nyanyi', 'gitar', 'piano', 'spotify'], label: 'Music' },
  { kw: ['baca', 'buku', 'artikel', 'riset', 'reading'], label: 'Reading' },
  { kw: ['masak', 'kopi', 'matcha', 'kuliner', 'baking', 'resep'], label: 'Culinary & Matcha' },
  { kw: ['foto', 'fotografi', 'kamera', 'video'], label: 'Fotografi' },
  { kw: ['rajut', 'merajut', 'lukis', 'melukis', 'gambar', 'craft'], label: 'Arts & Crafts' },
  { kw: ['game', 'gaming', 'main game'], label: 'Gaming' }
];

// Membersihkan awalan kalimat pengantar tetapi mempertahankan isi asli tulisan pengguna
function cleanLeadInPrefix(text) {
  if (!text) return '';
  return text
    .replace(/^(hari ini aku merasa|hari ini saya merasa|aku merasa|saya merasa|perasaanku hari ini|hal paling menyenangkan hari ini adalah|hal paling menyenangkan hari ini|hal paling menyenangkan|hal yang mengganggu pikiranku adalah|hal yang sedikit mengganggu pikiranku|yang mengganggu pikiranku|satu hal yang aku syukuri adalah|hal yang aku syukuri|aku bersyukur karena|aku bersyukur|hal baru yang aku pelajari hari ini|hal baru yang aku pikirkan|aku belajar bahwa|sesuatu yang ingin aku jadikan hobi|hobi yang ingin aku coba|impian masa depanku adalah|impian yang kubayangkan|besok aku ingin|besok aku mau|rencanaku besok)\s*[:,-]?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Meringkas klausa menjadi poin padat tanpa mengubah makna atau mengarang kata baru
function summarizeClauseStrictly(rawClause, maxWords = 8) {
  if (!rawClause) return '';
  const cleaned = cleanLeadInPrefix(rawClause)
    .replace(/^[,.;:!\-\s]+|[,.;:!\-\s]+$/g, '')
    .trim();
  if (!cleaned) return '';

  const subClauses = cleaned
    .split(/\s+(?:sehingga|walaupun|meskipun)\s+/i)
    .map(s => s.trim())
    .filter(Boolean);

  const primary = subClauses[0] || cleaned;
  const words = primary.split(/\s+/).filter(Boolean);

  let selectedWords = words;
  if (words.length > maxWords) {
    // Pangkas kata pengisi (filler) tanpa merusak kata benda/kerja utama
    const meaningful = words.filter((w, idx) => idx === 0 || idx === words.length - 1 || !['yang', 'sangat', 'cukup', 'sekali', 'banget', 'sedikit', 'itu', 'ini', 'tadi'].includes(w.toLowerCase()));
    selectedWords = (meaningful.length >= 4 ? meaningful : words).slice(0, maxWords);
  }

  const out = selectedWords.join(' ').replace(/[,.;:]+$/, '');
  return out.charAt(0).toUpperCase() + out.slice(1);
}

// Memecah teks panjang menjadi daftar kalimat/klausa bermakna
function splitIntoSentences(text) {
  if (!text) return [];
  return text
    .split(/[\n.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 2);
}

// Algoritma TextRank / TF-IDF Sentence Scoring Lokal untuk memilih kalimat paling penting di Free Writing
function rankSentencesByImportance(sentences) {
  if (sentences.length <= 1) return sentences;
  const wordFreq = {};
  sentences.forEach(sent => {
    const tokens = sent.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    tokens.forEach(t => {
      if (t.length > 2 && !STOPWORDS_ID.has(t)) {
        wordFreq[t] = (wordFreq[t] || 0) + 1;
      }
    });
  });

  const scored = sentences.map((sent, index) => {
    const tokens = sent.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    let score = 0;
    tokens.forEach(t => {
      if (wordFreq[t]) score += wordFreq[t];
    });
    const normScore = tokens.length > 0 ? score / Math.sqrt(tokens.length) : 0;
    // Bonus untuk kalimat pertama (biasanya menggambarkan kondisi utama)
    const positionBonus = index === 0 ? 1.25 : 1.0;
    return { sent, score: normScore * positionBonus, index };
  });

  return scored.sort((a, b) => b.score - a.score).map(item => item.sent);
}

// Fungsi Utama AI Lokal: Meringkas input pengguna secara akurat & menggabungkan konteks historis
function runLocalJournalAI(guidedInput, freeTextInput, moodId, allJournalsHistory = {}) {
  const mood = MOODS.find(m => m.id === moodId) || MOODS[2];
  const q1 = (guidedInput?.q1 || '').trim();
  const q2 = (guidedInput?.q2 || '').trim();
  const q3 = (guidedInput?.q3 || '').trim();
  const q4 = (guidedInput?.q4 || '').trim();
  const q5 = (guidedInput?.q5 || '').trim();
  const q6 = (guidedInput?.q6 || '').trim();
  const q7 = (guidedInput?.q7 || '').trim();
  const q8 = (guidedInput?.q8 || '').trim();
  const free = (freeTextInput || '').trim();

  const hasAnyInput = Boolean(q1 || q2 || q3 || q4 || q5 || q6 || q7 || q8 || free);
  const freeSentences = splitIntoSentences(free);
  const rankedFree = rankSentencesByImportance(freeSentences);
  const allCombinedText = [q1, q2, q3, q4, q5, q6, q7, q8, free].filter(Boolean).join('. ');
  const fullLower = allCombinedText.toLowerCase();

  // Jika pengguna belum mengisi teks apa pun, tampilkan status jujur sesuai mood
  if (!hasAnyInput) {
    return {
      self_reflection: {
        summary: `Mood ${mood.name} dipilih. Tulis ceritamu agar AI lokal dapat meringkas catatanmu.`,
        strengths: ['Meluangkan waktu membuka jurnal hari ini'],
        areas_to_improve: ['Belum ada catatan teks yang dimasukkan']
      },
      interests_and_hobbies: {
        interests: ['Journaling'],
        potential_hobbies: ['Menulis refleksi harian']
      },
      future_aspirations: {
        dreams: ['Mengenali diri lebih dalam'],
        career_goals: [],
        life_goals: []
      },
      personal_growth: {
        lessons_learned: ['Setiap perasaan layak dicatat'],
        recommended_actions: ['Isi minimal 1 pertanyaan panduan atau cerita bebas']
      }
    };
  }

  // -------------------------------------------------------------------------
  // 1. SELF REFLECTION (Summary, Hal Baik / Strengths, Perlu Diperhatikan)
  // -------------------------------------------------------------------------
  let summary = '';
  if (q1) {
    summary = `Mood ${mood.name}: ${summarizeClauseStrictly(q1, 9)}.`;
  } else if (rankedFree.length > 0) {
    summary = `Mood ${mood.name}: ${summarizeClauseStrictly(rankedFree[0], 9)}.`;
  } else {
    const firstNonEmpty = [q2, q4, q5, q3, q6, q7, q8].find(Boolean);
    summary = `Mood ${mood.name}: ${summarizeClauseStrictly(firstNonEmpty, 9)}.`;
  }

  const strengths = [];
  if (q2) {
    splitIntoSentences(q2).forEach(s => {
      const pt = summarizeClauseStrictly(s, 7);
      if (pt) strengths.push(pt);
    });
  }
  if (q4) {
    const pt = summarizeClauseStrictly(q4, 6);
    if (pt) strengths.push(`Mensyukuri: ${pt}`);
  }
  if (q5 && strengths.length < 3) {
    const pt = summarizeClauseStrictly(q5, 6);
    if (pt) strengths.push(`Belajar: ${pt}`);
  }
  // Ekstrak kalimat positif dari Free Writing
  freeSentences.forEach(s => {
    const lower = s.toLowerCase();
    if (POSITIVE_MARKERS.some(m => lower.includes(m)) && !FRICTION_MARKERS.some(f => lower.includes(f))) {
      const pt = summarizeClauseStrictly(s, 7);
      if (pt && !strengths.some(ex => ex.toLowerCase() === pt.toLowerCase())) {
        strengths.push(pt);
      }
    }
  });
  if (strengths.length === 0 && rankedFree.length > 0) {
    strengths.push(summarizeClauseStrictly(rankedFree[0], 7));
  }
  if (strengths.length === 0) {
    strengths.push('Jujur menuliskan refleksi diri hari ini');
  }

  const areas = [];
  if (q3) {
    splitIntoSentences(q3).forEach(s => {
      const pt = summarizeClauseStrictly(s, 7);
      if (pt) areas.push(pt);
    });
  }
  // Ekstrak kalimat kendala/kekhawatiran dari Free Writing atau Q1
  [... splitIntoSentences(q1), ...freeSentences].forEach(s => {
    const lower = s.toLowerCase();
    if (FRICTION_MARKERS.some(f => lower.includes(f))) {
      const pt = summarizeClauseStrictly(s, 7);
      if (pt && !areas.some(ex => ex.toLowerCase() === pt.toLowerCase())) {
        areas.push(pt);
      }
    }
  });
  if (areas.length === 0) {
    areas.push('Tidak ada kendala berat yang tertulis hari ini');
  }

  // -------------------------------------------------------------------------
  // 2. INTERESTS & HOBBIES (Murni dari Teks Q6, Q5, Q2 & Free Writing)
  // -------------------------------------------------------------------------
  const detectedInterests = [];
  const potentialHobbies = [];

  // A. Ambil langsung apa yang ditulis pengguna di Q6 (Hobi/Rutinitas)
  if (q6) {
    q6.split(/[,;\n]|(?:\s+dan\s+)|(?:\s+serta\s+)|(?:\s+atau\s+)/i)
      .map(part => summarizeClauseStrictly(part, 5))
      .filter(part => part.length > 2)
      .forEach(item => {
        if (!potentialHobbies.some(h => h.toLowerCase() === item.toLowerCase())) {
          potentialHobbies.push(item);
        }
        if (!detectedInterests.some(i => i.toLowerCase() === item.toLowerCase())) {
          detectedInterests.push(item);
        }
      });
  }

  // B. Cocokkan kata kunci yang benar-benar ada di dalam teks pengguna
  HOBBY_TAXONOMY.forEach(item => {
    if (item.kw.some(k => new RegExp(`\\b${k}`, 'i').test(fullLower))) {
      if (!detectedInterests.some(i => i.toLowerCase() === item.label.toLowerCase())) {
        detectedInterests.push(item.label);
      }
    }
  });

  // C. Jika di Q5 (Hal yang dipelajari/dipikirkan) ada topik spesifik, masukkan juga
  if (q5) {
    const learnedTopic = summarizeClauseStrictly(q5, 4);
    if (learnedTopic && learnedTopic.length > 2 && !detectedInterests.some(i => i.toLowerCase() === learnedTopic.toLowerCase())) {
      detectedInterests.push(learnedTopic);
    }
  }

  // D. Cari kalimat hobi/rutinitas di Free Writing
  freeSentences.forEach(s => {
    const lower = s.toLowerCase();
    if (lower.includes('hobi') || lower.includes('rutin') || lower.includes('latihan') || lower.includes('nyobain') || lower.includes('mencoba') || lower.includes('belajar')) {
      const pt = summarizeClauseStrictly(s, 6);
      if (pt && !potentialHobbies.some(h => h.toLowerCase() === pt.toLowerCase())) {
        potentialHobbies.push(pt);
      }
    }
  });

  if (detectedInterests.length === 0) {
    detectedInterests.push('Refleksi Diri');
  }
  if (potentialHobbies.length === 0) {
    potentialHobbies.push(detectedInterests[0]);
  }

  // -------------------------------------------------------------------------
  // 3. DREAMS & FUTURE ASPIRATIONS (Murni dari Q7 & Kalimat Masa Depan di Teks)
  // -------------------------------------------------------------------------
  const dreams = [];
  const careerGoals = [];
  const lifeGoals = [];

  const classifyAspiration = (rawItem) => {
    const pt = summarizeClauseStrictly(rawItem, 6);
    if (!pt || pt.length < 3) return;
    const low = pt.toLowerCase();
    if (low.includes('karier') || low.includes('kerja') || low.includes('bisnis') || low.includes('business') || low.includes('tech') || low.includes('perusahaan') || low.includes('profesional')) {
      if (!careerGoals.some(c => c.toLowerCase() === pt.toLowerCase())) careerGoals.push(pt);
    } else if (low.includes('hidup') || low.includes('finansial') || low.includes('mandiri') || low.includes('tenang') || low.includes('sehat') || low.includes('keluarga') || low.includes('rumah') || low.includes('tinggal')) {
      if (!lifeGoals.some(l => l.toLowerCase() === pt.toLowerCase())) lifeGoals.push(pt);
    } else {
      if (!dreams.some(d => d.toLowerCase() === pt.toLowerCase())) dreams.push(pt);
    }
  };

  if (q7) {
    q7.split(/[,;\n.]|(?:\s+dan\s+)|(?:\s+serta\s+)/i)
      .map(s => s.trim())
      .filter(Boolean)
      .forEach(classifyAspiration);
  }

  // Ekstrak kalimat berorientasi masa depan dari Free Writing
  freeSentences.forEach(s => {
    const low = s.toLowerCase();
    if (FUTURE_MARKERS.some(m => low.includes(m))) {
      classifyAspiration(s);
    }
  });

  // Jika Q7 kosong dan tidak ada kalimat masa depan di hari ini, cek apakah ada target dari Q8 atau riwayat sebelumnya
  if (dreams.length === 0 && careerGoals.length === 0 && lifeGoals.length === 0) {
    if (q8) {
      dreams.push(`Fokus jangka pendek: ${summarizeClauseStrictly(q8, 6)}`);
    } else {
      // Ambil aspirasi paling sering dari riwayat sebelumnya sebagai pengingat kompas diri
      const histDreams = {};
      Object.values(allJournalsHistory).forEach(entry => {
        (entry?.daily_insights?.future_aspirations?.dreams || []).forEach(d => {
          histDreams[d] = (histDreams[d] || 0) + 1;
        });
      });
      const topHistDream = Object.entries(histDreams).sort((a, b) => b[1] - a[1])[0];
      if (topHistDream) {
        dreams.push(`${topHistDream[0]} (Kompas dari catatan sebelumnya)`);
      } else {
        dreams.push('Bertumbuh konsisten dari hari ke hari');
      }
    }
  }

  // -------------------------------------------------------------------------
  // 4. PERSONAL GROWTH & NEXT STEPS (Murni dari Q5, Q8 & Konteks Kendala Q3)
  // -------------------------------------------------------------------------
  const lessons = [];
  if (q5) {
    splitIntoSentences(q5).forEach(s => {
      const pt = summarizeClauseStrictly(s, 8);
      if (pt) lessons.push(pt);
    });
  }
  freeSentences.forEach(s => {
    const low = s.toLowerCase();
    if (low.includes('belajar') || low.includes('sadar') || low.includes('paham') || low.includes('ternyata') || low.includes('pelajaran')) {
      const pt = summarizeClauseStrictly(s, 8);
      if (pt && !lessons.some(l => l.toLowerCase() === pt.toLowerCase())) {
        lessons.push(pt);
      }
    }
  });
  if (lessons.length === 0) {
    if (q4) {
      lessons.push(`Mensyukuri ${summarizeClauseStrictly(q4, 6)} menjaga hati tetap tenang`);
    } else {
      lessons.push(`Mengenali kondisi diri (${mood.name}) adalah langkah awal yang baik`);
    }
  }

  const recommendedActions = [];
  if (q8) {
    q8.split(/[,;\n.]|(?:\s+dan\s+)|(?:\s+lalu\s+)/i)
      .map(s => summarizeClauseStrictly(s, 7))
      .filter(s => s.length > 2)
      .forEach(act => {
        if (!recommendedActions.some(a => a.toLowerCase() === act.toLowerCase())) {
          recommendedActions.push(act);
        }
      });
  }

  // Ekstrak kalimat rencana dari Free Writing
  freeSentences.forEach(s => {
    const low = s.toLowerCase();
    if (ACTION_MARKERS.some(m => low.includes(m)) && (low.includes('besok') || low.includes('akan') || low.includes('mau') || low.includes('ingin'))) {
      const pt = summarizeClauseStrictly(s, 7);
      if (pt && !recommendedActions.some(a => a.toLowerCase() === pt.toLowerCase())) {
        recommendedActions.push(pt);
      }
    }
  });

  // Jika ada kendala di Q3 tapi belum ada langkah solutif di Q8, berikan rekomendasi yang menjawab kendala Q3 secara spesifik
  if (q3 && recommendedActions.length < 2) {
    const q3Low = q3.toLowerCase();
    if (q3Low.includes('lelah') || q3Low.includes('capek') || q3Low.includes('kurang tidur')) {
      recommendedActions.push('Prioritaskan istirahat cukup malam ini sebelum lanjut beraktivitas');
    } else if (q3Low.includes('tunda') || q3Low.includes('menunda')) {
      recommendedActions.push('Mulai kerjakan tugas selama 15 menit pertama esok hari');
    } else if (q3Low.includes('banyak ide') || q3Low.includes('bingung')) {
      recommendedActions.push('Pilih 1 prioritas utama saja untuk diselesaikan besok');
    } else {
      recommendedActions.push(`Atasi perlahan: ${summarizeClauseStrictly(q3, 6)}`);
    }
  }

  if (recommendedActions.length === 0 && q6) {
    recommendedActions.push(`Luangkan waktu untuk ${summarizeClauseStrictly(q6, 5)}`);
  }
  if (recommendedActions.length === 0) {
    recommendedActions.push(`Lanjutkan hal baik: ${strengths[0]}`);
  }

  return {
    self_reflection: {
      summary,
      strengths: strengths.slice(0, 3),
      areas_to_improve: areas.slice(0, 3)
    },
    interests_and_hobbies: {
      interests: detectedInterests.slice(0, 6),
      potential_hobbies: potentialHobbies.slice(0, 3)
    },
    future_aspirations: {
      dreams: dreams.slice(0, 3),
      career_goals: careerGoals.slice(0, 2),
      life_goals: lifeGoals.slice(0, 2)
    },
    personal_growth: {
      lessons_learned: lessons.slice(0, 3),
      recommended_actions: recommendedActions.slice(0, 3)
    }
  };
}

// ============================================================================
// 6. ENGINE ANALISIS LINTAS WAKTU: BULANAN, TAHUNAN & SELF-DISCOVERY
//    (Tetap Menghasilkan Ringkasan Akurat Meskipun Bulan/Tahun Belum Berakhir)
// ============================================================================
function computePeriodSynthesis(entriesList, periodLabel = 'Bulan Ini') {
  const sorted = [...entriesList].sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  const interestCounts = {};
  const dreamCounts = {};
  const areaCounts = {};
  const strengthList = [];
  const lessonList = [];
  const moodCounts = {};
  let totalEnergy = 0;

  sorted.forEach(entry => {
    const m = MOODS.find(x => x.id === entry.moodId) || MOODS[2];
    moodCounts[entry.moodId] = (moodCounts[entry.moodId] || 0) + 1;
    totalEnergy += m.energyScore;

    const ins = entry.daily_insights;
    if (!ins) return;

    (ins.interests_and_hobbies?.interests || []).forEach(item => {
      const k = item.trim();
      if (k) interestCounts[k] = (interestCounts[k] || 0) + 1;
    });

    const allDreams = [
      ...(ins.future_aspirations?.dreams || []),
      ...(ins.future_aspirations?.career_goals || []),
      ...(ins.future_aspirations?.life_goals || [])
    ];
    allDreams.forEach(d => {
      const cleanD = d.replace(/\s*\(Kompas dari catatan sebelumnya\)/i, '').trim();
      if (cleanD) dreamCounts[cleanD] = (dreamCounts[cleanD] || 0) + 1;
    });

    (ins.self_reflection?.areas_to_improve || []).forEach(a => {
      const k = a.trim();
      if (k && !k.includes('Tidak ada kendala') && !k.includes('Belum ada catatan')) {
        areaCounts[k] = (areaCounts[k] || 0) + 1;
      }
    });

    (ins.self_reflection?.strengths || []).forEach(s => {
      if (s && !strengthList.includes(s)) strengthList.push(s);
    });

    (ins.personal_growth?.lessons_learned || []).forEach(l => {
      if (l && !lessonList.includes(l)) lessonList.push(l);
    });
  });

  const sortedInterests = Object.entries(interestCounts)
    .map(([name, count]) => ({ name, count, status: count >= 2 ? 'Konsisten' : 'Baru 1x' }))
    .sort((a, b) => b.count - a.count);

  const sortedDreams = Object.entries(dreamCounts)
    .map(([name, count]) => ({ name, count, status: count >= 2 ? 'Cita-cita Konsisten' : 'Minat Sesaat (1x)' }))
    .sort((a, b) => b.count - a.count);

  const sortedPatterns = Object.entries(areaCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const sortedMoods = Object.entries(moodCounts)
    .map(([moodId, count]) => ({ mood: MOODS.find(m => m.id === moodId) || MOODS[2], count }))
    .sort((a, b) => b.count - a.count);

  const avgEnergy = sorted.length > 0 ? Math.round(totalEnergy / sorted.length) : 0;
  const topMood = sortedMoods[0]?.mood;
  const topInterestsText = sortedInterests.slice(0, 3).map(i => i.name).join(', ');
  const topDreamsText = sortedDreams.slice(0, 2).map(d => d.name).join(' & ');
  const topObstacleText = sortedPatterns[0]?.name;

  // Narasi Kesimpulan AI Real-Time untuk Bulan/Tahun yang Sedang Berjalan
  let narrativeSummary = '';
  if (sorted.length === 0) {
    narrativeSummary = `Belum ada catatan jurnal pada ${periodLabel}. Mulai tulis jurnal harianmu kapan saja—meskipun periode ini belum berakhir, AI lokal akan langsung merangkum perkembangannya secara otomatis.`;
  } else {
    const latestEntry = sorted[sorted.length - 1];
    narrativeSummary = `Berdasarkan ${sorted.length} catatan jurnal hingga tanggal ${latestEntry.day} (${periodLabel} masih berjalan), suasana hati dominanmu adalah ${topMood.name} (${topMood.colorName}) dengan rata-rata energi ${avgEnergy}%. `;
    if (topInterestsText) {
      narrativeSummary += `Fokus aktivitas dan minat yang paling sering kamu tulis meliputi ${topInterestsText}. `;
    }
    if (topDreamsText) {
      narrativeSummary += `Kompas impian masa depanmu mengarah kuat pada ${topDreamsText}. `;
    }
    if (topObstacleText) {
      narrativeSummary += `Hal yang perlu dijaga ke depannya: "${topObstacleText}".`;
    }
  }

  return {
    totalEntries: sorted.length,
    avgEnergy,
    sortedInterests,
    sortedDreams,
    sortedPatterns,
    sortedMoods,
    moodCounts,
    strengthList: strengthList.slice(-4).reverse(),
    lessonList: lessonList.slice(-3).reverse(),
    narrativeSummary
  };
}

// ============================================================================
// 7. MAIN APPLICATION COMPONENT (`App.jsx`)
// ============================================================================
export default function App() {
  // State Utama
  const [currentView, setCurrentView] = useState('home');
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashTransitionMood, setSplashTransitionMood] = useState(null);
  const [selectedMoodId, setSelectedMoodId] = useState('in_love');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(11); // 11 = November
  const [selectedDay, setSelectedDay] = useState(18);
  const [journalMode, setJournalMode] = useState('guided');
  const [homeSubTab, setHomeSubTab] = useState('aspirations');
  const [archiveSubTab, setArchiveSubTab] = useState('month');
  const [isFullWidthDesktop, setIsFullWidthDesktop] = useState(false);
  const [userName, setUserName] = useState('Lya');
  const [inputUserName, setInputUserName] = useState('Lya');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [completedActions, setCompletedActions] = useState({});
  const [seenMessageIndices, setSeenMessageIndices] = useState({});
  const [currentMessageIndexByMood, setCurrentMessageIndexByMood] = useState({ in_love: 2 });
  const [journals, setJournals] = useState(INITIAL_JOURNALS);

  // State Form Input Jurnal Harian
  const [guidedForm, setGuidedForm] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [freeTextForm, setFreeTextForm] = useState('');

  const insightsSectionRef = useRef(null);
  const toastTimerRef = useRef(null);

  // Helper format kunci tanggal YYYY-MM-DD
  const makeDateKey = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const currentDateKey = makeDateKey(selectedYear, selectedMonth, selectedDay);
  const currentMonthInfo = MONTHS_INFO.find(m => m.num === selectedMonth) || MONTHS_INFO[10];

  // Load state dari localStorage saat pertama kali dibuka
  useEffect(() => {
    try {
      const raw = localStorage.getItem('dear_future_me_lya_offline_v4');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.selectedMoodId) setSelectedMoodId(parsed.selectedMoodId);
        if (parsed.userName) {
          setUserName(parsed.userName);
          setInputUserName(parsed.userName);
        }
        if (parsed.completedActions) setCompletedActions(parsed.completedActions);
        if (parsed.journals && Object.keys(parsed.journals).length > 0) {
          // Migrasi otomatis jika ada kunci lama berupa angka hari saja
          const normalized = {};
          Object.entries(parsed.journals).forEach(([k, val]) => {
            if (/^\d+$/.test(k)) {
              const dNum = parseInt(k, 10);
              const fullKey = makeDateKey(2026, 11, dNum);
              normalized[fullKey] = { ...val, year: 2026, month: 11, day: dNum, dateStr: fullKey };
            } else {
              normalized[k] = val;
            }
          });
          setJournals(normalized);
        }
      }
    } catch (err) {
      console.error('Failed loading state:', err);
    }
  }, []);

  // Simpan otomatis ke localStorage ketika ada perubahan data
  useEffect(() => {
    try {
      localStorage.setItem('dear_future_me_lya_offline_v4', JSON.stringify({
        selectedMoodId,
        userName,
        completedActions,
        journals
      }));
    } catch (err) {
      console.error('Failed saving state:', err);
    }
  }, [selectedMoodId, userName, completedActions, journals]);

  // Terapkan CSS Variables setiap kali mood berganti
  useEffect(() => {
    const mood = MOODS.find(m => m.id === selectedMoodId) || MOODS[2];
    const root = document.documentElement;
    root.style.setProperty('--mood-main', mood.hex);
    root.style.setProperty('--mood-soft', mood.softBg);
    root.style.setProperty('--mood-card', mood.cardBg);
    root.style.setProperty('--mood-pill', mood.pillBg);
    root.style.setProperty('--mood-dark', mood.darkText);
    root.style.setProperty('--mood-accent', mood.accent);
  }, [selectedMoodId]);

  // Sinkronkan form input jurnal ketika pengguna memilih tanggal/bulan/tahun berbeda
  useEffect(() => {
    const entry = journals[currentDateKey];
    if (entry) {
      setGuidedForm({
        q1: entry.guided?.q1 || '',
        q2: entry.guided?.q2 || '',
        q3: entry.guided?.q3 || '',
        q4: entry.guided?.q4 || '',
        q5: entry.guided?.q5 || '',
        q6: entry.guided?.q6 || '',
        q7: entry.guided?.q7 || '',
        q8: entry.guided?.q8 || ''
      });
      setFreeTextForm(entry.freeText || '');
    } else {
      setGuidedForm({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
      setFreeTextForm('');
    }
  }, [currentDateKey, journals]);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
    }, 2400);
  };

  const getMoodById = (id) => MOODS.find(m => m.id === id) || MOODS[2];

  // Picker Pesan Non-Repeating
  const pickNonRepeatingMoodMessageIndex = (moodId) => {
    const collection = MOOD_MESSAGES_COLLECTION[moodId] || MOOD_MESSAGES_COLLECTION.in_love;
    const total = collection.messages.length;
    const prevSeen = seenMessageIndices[moodId] || [];
    const resetSeen = prevSeen.length >= total ? [prevSeen[total - 1]] : prevSeen;
    const available = [];
    for (let i = 0; i < total; i++) {
      if (!resetSeen.includes(i)) available.push(i);
    }
    const chosen = available[Math.floor(Math.random() * available.length)] || 0;
    setSeenMessageIndices(prev => ({ ...prev, [moodId]: [...resetSeen, chosen] }));
    setCurrentMessageIndexByMood(prev => ({ ...prev, [moodId]: chosen }));
    return chosen;
  };

  // Handler memilih mood dari Splash Screen -> animasi warna -> otomatis masuk Home
  const handleSelectMoodFromSplash = (moodId) => {
    setSplashTransitionMood(moodId);
    setSelectedMoodId(moodId);
    pickNonRepeatingMoodMessageIndex(moodId);

    setTimeout(() => {
      setSplashVisible(false);
      setSplashTransitionMood(null);
      setCurrentView('home');
    }, 420);
  };

  const openSplashMoodScreen = () => {
    setSplashTransitionMood(null);
    setSplashVisible(true);
  };

  // Simpan & Jalankan Model AI Lokal pada Jurnal Harian
  const handleSaveAndAnalyzeJournal = () => {
    const aiInsights = runLocalJournalAI(guidedForm, freeTextForm, selectedMoodId, journals);
    const updatedEntry = {
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      dateStr: currentDateKey,
      moodId: selectedMoodId,
      guided: { ...guidedForm },
      freeText: freeTextForm,
      daily_insights: aiInsights
    };

    setJournals(prev => ({
      ...prev,
      [currentDateKey]: updatedEntry
    }));

    showToast(`Jurnal ${selectedDay} ${currentMonthInfo.short} ${selectedYear} berhasil diringkas & disimpan! ✨`);
    setTimeout(() => {
      insightsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Hapus jurnal pada tanggal tertentu jika diperlukan
  const handleDeleteJournalEntry = (dateKey) => {
    setJournals(prev => {
      const copy = { ...prev };
      delete copy[dateKey];
      return copy;
    });
    showToast('Catatan jurnal dihapus.');
  };

  // Live Preview AI Insights untuk tanggal yang sedang dibuka
  const activeDailyInsights = useMemo(() => {
    const saved = journals[currentDateKey];
    // Jika pengguna sedang mengetik perubahan baru di form, tampilkan hasil olahan real-time
    const hasUnsavedTyping =
      Object.values(guidedForm).some(v => v.trim().length > 0) || freeTextForm.trim().length > 0;
    if (hasUnsavedTyping) {
      return runLocalJournalAI(guidedForm, freeTextForm, selectedMoodId, journals);
    }
    if (saved?.daily_insights) {
      return saved.daily_insights;
    }
    return runLocalJournalAI(guidedForm, freeTextForm, selectedMoodId, journals);
  }, [currentDateKey, journals, guidedForm, freeTextForm, selectedMoodId]);

  // Data Agregasi Seluruh Waktu (All-Time Self-Discovery)
  const allTimeSynthesis = useMemo(() => {
    return computePeriodSynthesis(Object.values(journals), 'Seluruh Catatan');
  }, [journals]);

  // Data Agregasi Bulan yang Sedang Dipilih (Berjalan / In-Progress)
  const currentMonthEntries = useMemo(() => {
    const prefix = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-`;
    return Object.values(journals).filter(e => e.dateStr?.startsWith(prefix));
  }, [journals, selectedYear, selectedMonth]);

  const monthlySynthesis = useMemo(() => {
    return computePeriodSynthesis(currentMonthEntries, `${currentMonthInfo.full} ${selectedYear}`);
  }, [currentMonthEntries, currentMonthInfo, selectedYear]);

  // Data Agregasi Tahun yang Sedang Dipilih (Berjalan / In-Progress)
  const currentYearEntries = useMemo(() => {
    const prefix = `${selectedYear}-`;
    return Object.values(journals).filter(e => e.dateStr?.startsWith(prefix));
  }, [journals, selectedYear]);

  const yearlySynthesis = useMemo(() => {
    return computePeriodSynthesis(currentYearEntries, `Tahun ${selectedYear}`);
  }, [currentYearEntries, selectedYear]);

  // Informasi Mood Aktif & Maskot Pendamping
  const activeMoodIndex = MOODS.findIndex(m => m.id === selectedMoodId);
  const activeMood = MOODS[activeMoodIndex >= 0 ? activeMoodIndex : 2];
  const buddyMood1 = MOODS[(activeMoodIndex + 1) % MOODS.length];
  const buddyMood2 = MOODS[(activeMoodIndex + 3) % MOODS.length];
  const activeMsgCollection = MOOD_MESSAGES_COLLECTION[selectedMoodId] || MOOD_MESSAGES_COLLECTION.in_love;
  const activeMsgIdx = currentMessageIndexByMood[selectedMoodId] ?? 0;
  const activeNoteMessage = activeMsgCollection.messages[activeMsgIdx] || activeMsgCollection.messages[0];

  // Mood untuk tampilan Splash Screen
  const splashMoodObj = splashTransitionMood ? getMoodById(splashTransitionMood) : activeMood;
  const splashMsgCollection = MOOD_MESSAGES_COLLECTION[splashMoodObj.id] || MOOD_MESSAGES_COLLECTION.in_love;

  // Frekuensi Minat & Impian untuk Badge Konsisten vs Baru 1x
  const interestFreqMap = useMemo(() => {
    const map = {};
    allTimeSynthesis.sortedInterests.forEach(it => {
      map[it.name.toLowerCase()] = it.count;
    });
    return map;
  }, [allTimeSynthesis]);

  const dreamFreqMap = useMemo(() => {
    const map = {};
    allTimeSynthesis.sortedDreams.forEach(d => {
      map[d.name.toLowerCase()] = d.count;
    });
    return map;
  }, [allTimeSynthesis]);

  // Langkah Kecil Besok di Home (dari jurnal tanggal terpilih atau jurnal terakhir yang ada)
  const latestSavedEntry = useMemo(() => {
    if (journals[currentDateKey]) return journals[currentDateKey];
    const allSorted = Object.values(journals).sort((a, b) => b.dateStr.localeCompare(a.dateStr));
    return allSorted[0] || null;
  }, [journals, currentDateKey]);

  const homeRecommendedActions = latestSavedEntry?.daily_insights?.personal_growth?.recommended_actions || [
    'Tulis jurnal singkat malam ini',
    'Pilih 1 prioritas utama untuk besok'
  ];

  const completedCount = homeRecommendedActions.filter((_, idx) => {
    const key = `${latestSavedEntry?.dateStr || currentDateKey}_${idx}`;
    return !!completedActions[key];
  }).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4">
      {/* Top Responsive Bar for Desktop/Tablet Preview Controls */}
      <div className="w-full max-w-5xl mb-3 hidden sm:flex items-center justify-between bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-white">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: 'var(--mood-main)' }}
          />
          <span className="font-bold text-slate-800 text-sm tracking-tight">
            Dear Future Me · {userName}'s Journal
          </span>
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: 'var(--mood-card)', color: 'var(--mood-dark)' }}
          >
            Mood: {activeMood.name} · {activeMood.colorName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openSplashMoodScreen}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            🎨 Buka Splash Mood
          </button>
          <button
            onClick={() => setIsFullWidthDesktop(prev => !prev)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {isFullWidthDesktop ? 'Tampilan: Lebar (Tablet/Desktop)' : 'Tampilan: HP (Mobile Frame)'}
          </button>
          <button
            onClick={() => {
              setInputUserName(userName);
              setSettingsOpen(true);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full text-white transition"
            style={{ backgroundColor: 'var(--mood-main)' }}
          >
            ⚙️ Profil {userName}
          </button>
        </div>
      </div>

      {/* Main Mobile App Container */}
      <div
        id="appShell"
        className={`w-full ${isFullWidthDesktop ? 'max-w-3xl' : 'max-w-[440px]'} min-h-screen sm:min-h-[860px] sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-white relative overflow-hidden flex flex-col theme-transition`}
        style={{ backgroundColor: 'var(--mood-soft)' }}
      >
        {/* ================= SPLASH SCREEN ================= */}
        {splashVisible && (
          <div
            className={`absolute inset-0 z-50 flex flex-col justify-between p-6 overflow-y-auto theme-transition ${
              splashTransitionMood ? '' : 'splash-grey-pattern'
            }`}
            style={{
              backgroundColor: splashTransitionMood ? splashMoodObj.hex : '#ECEEF2'
            }}
          >
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/45 pointer-events-none" />
            <div className="absolute bottom-24 -left-12 w-40 h-40 rounded-full bg-white/40 pointer-events-none" />

            {/* Splash Top Header */}
            <div className="relative z-10 flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white">
                <span className="text-sm">🐾</span>
                <span className="text-xs font-extrabold text-slate-700 tracking-wide">
                  DEAR FUTURE ME
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-white/75 px-3 py-1 rounded-full shadow-sm">
                Hi, <span>{userName}</span> ✨
              </span>
            </div>

            {/* Splash Greeting */}
            <div className="relative z-10 text-center mt-2">
              <p
                className={`text-xs font-extrabold uppercase tracking-widest mb-1 transition ${
                  splashTransitionMood ? 'text-white/90' : 'text-slate-500'
                }`}
              >
                Welcome Back, {userName}
              </p>
              <h1
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight transition ${
                  splashTransitionMood ? 'text-white' : 'text-slate-800'
                }`}
              >
                How are you feeling today?
              </h1>
            </div>

            {/* Center Cute Mascot Preview Card */}
            <div className="relative z-10 my-2 flex flex-col items-center">
              <div className="w-48 h-48 rounded-[38px] bg-white/75 backdrop-blur-md border-2 border-white flex flex-col items-center justify-center p-4 shadow-md relative">
                <div className="w-32 h-32 animate-float flex items-center justify-center">
                  <CuteAnimal type={splashMoodObj.animalType} sizeClass="w-32 h-32" />
                </div>
              </div>

              <div className="text-center mt-3 px-3">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase mb-1 ${
                    splashTransitionMood
                      ? 'bg-black/15 text-white'
                      : 'bg-slate-800/10 text-slate-700'
                  }`}
                >
                  {splashTransitionMood
                    ? `${splashMoodObj.colorName} · ${splashMoodObj.hex}`
                    : 'Sentuh mood untuk masuk ✨'}
                </div>
                <h2
                  className={`text-xl sm:text-2xl font-black tracking-wider uppercase ${
                    splashTransitionMood ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {splashTransitionMood
                    ? `${splashMoodObj.petName} · ${splashMoodObj.name}`
                    : `HOW ARE YOU, ${userName.toUpperCase()}?`}
                </h2>
                <p
                  className={`text-xs font-medium mt-0.5 max-w-xs mx-auto leading-relaxed ${
                    splashTransitionMood ? 'text-white/95' : 'text-slate-600'
                  }`}
                >
                  {splashTransitionMood
                    ? splashMsgCollection.tagline
                    : 'Sentuh salah satu karakter lucu di bawah—warna aplikasi akan berubah dan langsung membawamu masuk.'}
                </p>
              </div>
            </div>

            {/* 12 Mood Categories Selector Grid */}
            <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-[28px] p-3.5 border border-white shadow-sm">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  12 Kategori Mood
                </span>
                <span className="text-[10px] text-slate-500 font-bold">
                  Sentuh untuk langsung masuk
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-0.5">
                {MOODS.map(m => {
                  const isSelected = m.id === selectedMoodId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMoodFromSplash(m.id)}
                      className="p-2 rounded-2xl flex flex-col items-center justify-center transition bg-white hover:scale-105 shadow-sm"
                      style={{ border: `2px solid ${isSelected ? m.hex : 'transparent'}` }}
                    >
                      <div className="w-9 h-9 flex items-center justify-center">
                        <CuteAnimal type={m.animalType} sizeClass="w-9 h-9" />
                      </div>
                      <span
                        className="text-[10px] font-extrabold mt-1 truncate w-full text-center"
                        style={{ color: m.darkText }}
                      >
                        {m.name}
                      </span>
                      <span
                        className="w-4 h-1.5 rounded-full mt-0.5"
                        style={{ backgroundColor: m.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 1: HOME DASHBOARD ================= */}
        {currentView === 'home' && (
          <section className="flex-1 flex flex-col p-5 pb-28 overflow-y-auto">
            {/* Personal Greeting Header */}
            <div className="flex items-center justify-between pt-1 mb-4">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: 'var(--mood-accent)' }}
                >
                  {selectedDay} {currentMonthInfo.full} {selectedYear}
                </p>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5">
                  Hi, <span>{userName}</span> 👋🏼
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openSplashMoodScreen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-white hover:scale-105 transition"
                  title="Ganti Mood Hari Ini"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <CuteAnimal type={activeMood.animalType} sizeClass="w-5 h-5" />
                  </span>
                  <span
                    className="text-xs font-extrabold"
                    style={{ color: 'var(--mood-dark)' }}
                  >
                    {activeMood.name}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setInputUserName(userName);
                    setSettingsOpen(true);
                  }}
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 relative hover:scale-105 transition"
                  title="Profil"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span
                    className="w-2.5 h-2.5 rounded-full absolute top-2 right-2"
                    style={{ backgroundColor: 'var(--mood-main)' }}
                  />
                </button>
              </div>
            </div>

            {/* TOP HERO BANNER: "A LITTLE NOTE FOR YOU" */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-extrabold tracking-tight" style={{ color: 'var(--mood-dark)' }}>
                  Dear Future Me · A Little Note for You
                </span>
                <button
                  onClick={openSplashMoodScreen}
                  className="text-[11px] font-bold px-3 py-1 rounded-full transition hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                >
                  My mood today ↻
                </button>
              </div>

              <div
                className="p-5 rounded-[30px] relative overflow-hidden shadow-sm border-2 border-white/90 theme-transition"
                style={{ backgroundColor: 'var(--mood-card)' }}
              >
                {/* Cute Mascots Background Watermark Layer */}
                <div className="absolute -right-3 -bottom-4 w-32 h-32 opacity-35 pointer-events-none transform rotate-6 animate-float">
                  <CuteAnimal type={activeMood.animalType} sizeClass="w-32 h-32" />
                </div>
                <div className="absolute right-24 -top-4 w-16 h-16 opacity-20 pointer-events-none transform -rotate-12">
                  <CuteAnimal type={buddyMood1.animalType} sizeClass="w-16 h-16" />
                </div>
                <div className="absolute left-3 bottom-12 w-12 h-12 opacity-15 pointer-events-none transform rotate-12">
                  <CuteAnimal type={buddyMood2.animalType} sizeClass="w-12 h-12" />
                </div>
                <div className="absolute right-6 top-12 text-base opacity-40 pointer-events-none">✨</div>
                <div className="absolute right-28 bottom-4 text-sm opacity-35 pointer-events-none">🐾</div>

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex-1 pr-6">
                    <h2
                      className="text-base sm:text-lg font-extrabold tracking-tight leading-snug"
                      style={{ color: 'var(--mood-dark)' }}
                    >
                      {activeMsgCollection.tagline}
                    </h2>
                    <p
                      className="text-xs sm:text-sm font-semibold mt-2 leading-relaxed"
                      style={{ color: 'var(--mood-dark)', opacity: 0.92 }}
                    >
                      {activeNoteMessage}
                    </p>
                  </div>
                  <button
                    onClick={() => pickNonRepeatingMoodMessageIndex(selectedMoodId)}
                    className="w-8 h-8 rounded-full bg-white/75 hover:bg-white flex items-center justify-center text-xs shadow-sm shrink-0 transition"
                    style={{ color: 'var(--mood-dark)' }}
                    title="Pesan lainnya untuk mood ini"
                  >
                    ↻
                  </button>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-4 pt-2.5 border-t border-black/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/85 p-1 flex items-center justify-center shadow-sm">
                      <CuteAnimal type={activeMood.animalType} sizeClass="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{activeMsgCollection.symbol}</span>
                        <span className="text-xs font-extrabold" style={{ color: 'var(--mood-dark)' }}>
                          Feeling {activeMood.name}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-semibold opacity-75 block"
                        style={{ color: 'var(--mood-dark)' }}
                      >
                        Note {activeMsgIdx + 1} of 10 · Specially for {userName}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={openSplashMoodScreen}
                    className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-white/70 hover:bg-white transition"
                    style={{ color: 'var(--mood-dark)' }}
                  >
                    Ganti Mood
                  </button>
                </div>
              </div>
            </div>

            {/* Dual Action Cards */}
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
              Catatan & Rangkuman Harian {userName}
            </p>
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              <div
                onClick={() => setCurrentView('journal')}
                className="pastel-card p-4 flex flex-col justify-between min-h-[140px] cursor-pointer hover:scale-[1.02] transition relative overflow-hidden"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center p-1 shadow-sm"
                  style={{ backgroundColor: 'var(--mood-card)' }}
                >
                  <CuteAnimal type={activeMood.animalType} sizeClass="w-10 h-10" />
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Daily Diary
                    </span>
                    <h3 className="text-sm font-extrabold leading-snug text-slate-800">
                      Tulis Jurnal
                    </h3>
                  </div>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm font-bold text-xs"
                    style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                  >
                    →
                  </span>
                </div>
              </div>

              <div
                onClick={() => {
                  setCurrentView('journal');
                  setTimeout(() => {
                    insightsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }}
                className="p-4 rounded-[28px] flex flex-col justify-between min-h-[140px] cursor-pointer hover:scale-[1.02] transition text-white shadow-md relative overflow-hidden"
                style={{ backgroundColor: 'var(--mood-dark)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl">
                  💗
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/75">
                      Self-Discovery
                    </span>
                    <h3 className="text-sm font-extrabold leading-snug text-white">
                      4 Kesimpulan
                    </h3>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                    →
                  </span>
                </div>
              </div>
            </div>

            {/* Emotional Balance Indicator Card */}
            <div className="pastel-card p-5 mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                  >
                    {activeMsgCollection.symbol}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{userName}'s Mood Journey</h3>
                    <p className="text-[11px] text-slate-500">
                      Tren suasana hati 12 tanggal pada {currentMonthInfo.short} {selectedYear}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setArchiveSubTab('month');
                    setCurrentView('archive');
                  }}
                  className="text-[11px] font-extrabold px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                >
                  Kalender 1-{currentMonthInfo.days} →
                </button>
              </div>
              <div className="h-24 flex items-end justify-between gap-1.5 pt-4 px-1">
                {[2, 4, 5, 7, 9, 11, 12, 14, 15, 16, 17, 18].map(d => {
                  const dKey = makeDateKey(selectedYear, selectedMonth, d);
                  const entry = journals[dKey];
                  const m = entry ? getMoodById(entry.moodId) : activeMood;
                  const heightPct = entry ? m.energyScore : 45;
                  const barColor = entry ? m.hex : '#CBD5E1';
                  return (
                    <div
                      key={d}
                      onClick={() => {
                        setSelectedDay(d);
                        setCurrentView('journal');
                      }}
                      className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                      title={`Tanggal ${d} ${currentMonthInfo.short}: ${entry ? m.name : 'Belum diisi'}`}
                    >
                      <div className="w-full max-w-[14px] bg-slate-100 rounded-full h-16 flex items-end p-0.5 overflow-hidden">
                        <div
                          className="w-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ height: `${heightPct}%`, backgroundColor: barColor }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{d}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Long-Term Self Discovery Preview Tabs */}
            <div className="mb-3 flex items-center justify-between border-b border-slate-200/70 pb-2">
              <div className="flex items-center gap-4">
                {[
                  { id: 'aspirations', label: 'Impian Masa Depan' },
                  { id: 'interests', label: 'Minat & Hobi' },
                  { id: 'patterns', label: 'Pola Diri' }
                ].map(t => {
                  const active = homeSubTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setHomeSubTab(t.id)}
                      className={`text-xs pb-1.5 transition ${
                        active
                          ? 'font-extrabold text-slate-800 border-b-2'
                          : 'font-semibold text-slate-400 hover:text-slate-700'
                      }`}
                      style={{ borderColor: active ? 'var(--mood-main)' : 'transparent' }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 Pastel Cards */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {(() => {
                const pastelBgSet = ['#F6DCE8', '#E2DCF8', '#D8ECE2'];
                let items = [];
                if (homeSubTab === 'aspirations') {
                  items = allTimeSynthesis.sortedDreams.slice(0, 3).map((d, idx) => ({
                    title: d.name,
                    sub: `${d.count}x · ${d.count >= 2 ? 'Konsisten' : 'Baru 1x'}`,
                    icon: idx === 0 ? '🎓' : idx === 1 ? '💼' : '🌍',
                    bg: pastelBgSet[idx % 3]
                  }));
                } else if (homeSubTab === 'interests') {
                  items = allTimeSynthesis.sortedInterests.slice(0, 3).map((it, idx) => ({
                    title: it.name,
                    sub: `${it.count}x · ${it.count >= 2 ? 'Rutin' : 'Baru 1x'}`,
                    icon: idx === 0 ? '💻' : idx === 1 ? '🧘‍♀️' : '✍️',
                    bg: pastelBgSet[idx % 3]
                  }));
                } else {
                  items = allTimeSynthesis.sortedPatterns.slice(0, 3).map((p, idx) => ({
                    title: p.name,
                    sub: `${p.count}x tercatat`,
                    icon: idx === 0 ? '🔋' : idx === 1 ? '💡' : '🕰️',
                    bg: pastelBgSet[idx % 3]
                  }));
                }

                return items.map((card, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setArchiveSubTab('board');
                      setCurrentView('archive');
                    }}
                    className="p-3.5 rounded-[24px] flex flex-col justify-between min-h-[118px] cursor-pointer hover:scale-[1.02] transition shadow-sm"
                    style={{ backgroundColor: card.bg }}
                  >
                    <div>
                      <p className="text-xs font-extrabold text-slate-800 leading-snug">
                        {card.title}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-600 mt-1">
                        {card.sub}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-white/75 flex items-center justify-center text-base self-end mt-2 shadow-sm">
                      {card.icon}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Recommended Actions for Tomorrow */}
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800">Langkah Kecil Besok</h3>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--mood-accent)' }}>
                {completedCount}/{homeRecommendedActions.length} selesai
              </span>
            </div>
            <div className="space-y-2.5">
              {homeRecommendedActions.map((act, idx) => {
                const key = `${latestSavedEntry?.dateStr || currentDateKey}_${idx}`;
                const isDone = !!completedActions[key];
                const badgeColors = ['#E4DFF4', '#D8E7F7', '#D9ECE1'];
                const icons = ['✨', '☀️', '🌱'];
                return (
                  <div
                    key={key}
                    onClick={() =>
                      setCompletedActions(prev => ({ ...prev, [key]: !prev[key] }))
                    }
                    className="pastel-card p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.01] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-base shrink-0"
                        style={{ backgroundColor: badgeColors[idx % 3] }}
                      >
                        {icons[idx % 3]}
                      </div>
                      <div>
                        <h4
                          className={`text-xs font-extrabold ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {act}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Rekomendasi dari jurnal {latestSavedEntry?.day || selectedDay} {currentMonthInfo.short}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-700 text-slate-700'
                      }`}
                    >
                      {isDone ? '✓' : '▶'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= VIEW 2: MY LITTLE DAILY JOURNAL (+) & 4 KESIMPULAN ================= */}
        {currentView === 'journal' && (
          <section className="flex-1 flex flex-col p-5 pb-28 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentView('home')}
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 hover:scale-105 transition"
              >
                ←
              </button>
              <div className="text-center">
                <h2 className="text-sm font-extrabold text-slate-800">My Little Daily Journal</h2>
                <p className="text-[11px] text-slate-500">Daily diary · Offline AI Summarizer</p>
              </div>
              <button
                onClick={openSplashMoodScreen}
                className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--mood-card)', color: 'var(--mood-dark)' }}
              >
                <span>{activeMood.name}</span> 🎨
              </button>
            </div>

            {/* Month & Date Picker Strip */}
            <div className="pastel-card p-3.5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      const newM = Number(e.target.value);
                      setSelectedMonth(newM);
                      const maxD = MONTHS_INFO.find(x => x.num === newM)?.days || 30;
                      if (selectedDay > maxD) setSelectedDay(maxD);
                    }}
                    className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full focus:outline-none"
                  >
                    {MONTHS_INFO.map(m => (
                      <option key={m.num} value={m.num}>
                        {m.full} {selectedYear}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-xs font-extrabold" style={{ color: 'var(--mood-dark)' }}>
                  {selectedDay} {currentMonthInfo.short} {selectedYear}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {Array.from({ length: currentMonthInfo.days }, (_, i) => i + 1).map(d => {
                  const dKey = makeDateKey(selectedYear, selectedMonth, d);
                  const entry = journals[dKey];
                  const isCurrent = d === selectedDay;
                  const entryMood = entry ? getMoodById(entry.moodId) : null;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDay(d);
                        if (entry?.moodId) setSelectedMoodId(entry.moodId);
                      }}
                      className={`w-9 h-11 rounded-2xl shrink-0 flex flex-col items-center justify-center text-xs font-extrabold transition ${
                        isCurrent
                          ? 'text-white shadow-md scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      style={isCurrent ? { backgroundColor: 'var(--mood-dark)' } : {}}
                    >
                      <span>{d}</span>
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-0.5"
                        style={{ backgroundColor: entry ? entryMood.hex : 'transparent' }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Switcher: 8 Guided Questions vs Free Writing */}
            <div className="bg-white/80 p-1 rounded-full flex items-center mb-3 shadow-sm border border-white">
              <button
                onClick={() => setJournalMode('guided')}
                className="flex-1 py-2 rounded-full text-xs font-bold transition shadow-sm"
                style={
                  journalMode === 'guided'
                    ? { backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }
                    : { color: '#64748B' }
                }
              >
                8 Pertanyaan Panduan
              </button>
              <button
                onClick={() => setJournalMode('free')}
                className="flex-1 py-2 rounded-full text-xs font-bold transition"
                style={
                  journalMode === 'free'
                    ? { backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }
                    : { color: '#64748B' }
                }
              >
                Free Writing (Bebas)
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-3 px-1">
              Tidak harus diisi semua—tulis senyamanmu, {userName}. AI lokal akan mengolah langsung kalimat yang kamu tulis 💗
            </p>

            {/* 8 Guided Questions */}
            {journalMode === 'guided' ? (
              <div className="space-y-3 mb-4">
                {[
                  { id: 'q1', label: '1. Hari ini aku merasa...', placeholder: 'Ceritakan perasaan dan energimu hari ini...' },
                  { id: 'q2', label: '2. Hal paling menyenangkan hari ini...', placeholder: 'Momen kecil atau pencapaian yang bikin tersenyum...' },
                  { id: 'q3', label: '3. Hal yang sedikit mengganggu pikiranku...', placeholder: 'Kekhawatiran, kelelahan, atau kebiasaan yang menghambat...' },
                  { id: 'q4', label: '4. Satu hal yang aku syukuri...', placeholder: 'Hal sederhana yang membuatmu merasa cukup hari ini...' },
                  { id: 'q5', label: '5. Hal baru yang aku pikirkan atau pelajari hari ini...', placeholder: 'Ide, topik menarik, atau pelajaran hidup...' },
                  { id: 'q6', label: '6. Sesuatu yang ingin aku coba jadikan hobi atau rutinitas...', placeholder: 'Contoh: coding personal project, Pilates, menulis, membaca...' },
                  { id: 'q7', label: '7. Impian, cita-cita, atau kehidupan masa depan yang sempat aku bayangkan hari ini...', placeholder: 'Karier, S2, kemandirian finansial, tinggal di luar negeri...' },
                  { id: 'q8', label: '8. Besok aku ingin...', placeholder: 'Langkah kecil yang ingin dilakukan besok...' }
                ].map(q => (
                  <div key={q.id} className="pastel-card p-4">
                    <label
                      className="block text-xs font-bold mb-1.5"
                      style={{ color: 'var(--mood-dark)' }}
                    >
                      {q.label}
                    </label>
                    <textarea
                      rows="2"
                      value={guidedForm[q.id]}
                      onChange={(e) =>
                        setGuidedForm(prev => ({ ...prev, [q.id]: e.target.value }))
                      }
                      className="w-full text-xs text-slate-700 bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 focus:outline-none focus:border-slate-400"
                      placeholder={q.placeholder}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="pastel-card p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--mood-dark)' }}>
                    Cerita Bebas Malam Ini
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Bebas menulis panjang seperti diary biasa
                  </span>
                </div>
                <textarea
                  rows="9"
                  value={freeTextForm}
                  onChange={(e) => setFreeTextForm(e.target.value)}
                  className="w-full text-xs leading-relaxed text-slate-700 bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70 focus:outline-none focus:border-slate-400"
                  placeholder={`Tulis apa saja yang ${userName} rasakan, pikirkan, impikan, atau pelajari hari ini...`}
                />
              </div>
            )}

            {/* Save & Summarize Button */}
            <button
              onClick={handleSaveAndAnalyzeJournal}
              className="w-full py-4 rounded-full text-white font-extrabold text-sm shadow-lg hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 mb-6"
              style={{ backgroundColor: 'var(--mood-dark)' }}
            >
              <span>Simpan & Ringkas dengan AI Lokal ✨</span>
            </button>

            {/* ================= 4 KESIMPULAN RINGKAS ================= */}
            <div ref={insightsSectionRef} className="space-y-3.5">
              <div className="px-1 flex items-center justify-between">
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                  >
                    Ringkasan Harian Offline
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 mt-1">
                    4 Kesimpulan & Rekomendasi {userName}
                  </h3>
                </div>
                {journals[currentDateKey] && (
                  <button
                    onClick={() => handleDeleteJournalEntry(currentDateKey)}
                    className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full hover:bg-rose-100"
                  >
                    Hapus Catatan
                  </button>
                )}
              </div>

              {/* Card 01: Self Reflection */}
              <div
                className="pastel-card p-4 border-l-4"
                style={{ borderLeftColor: 'var(--mood-main)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wider"
                    style={{ color: 'var(--mood-accent)' }}
                  >
                    01 · Self Reflection
                  </span>
                  <span className="text-xs">🪞</span>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-snug mb-2.5">
                  {activeDailyInsights.self_reflection?.summary}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl p-2.5 bg-emerald-50/75 border border-emerald-100">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 block mb-1">
                      💪 Hal Baik
                    </span>
                    <ul className="text-[11px] font-medium text-emerald-950 space-y-1 list-disc list-inside">
                      {(activeDailyInsights.self_reflection?.strengths || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl p-2.5 bg-amber-50/80 border border-amber-100">
                    <span className="text-[10px] font-extrabold uppercase text-amber-800 block mb-1">
                      🔍 Perlu Diperhatikan
                    </span>
                    <ul className="text-[11px] font-medium text-amber-950 space-y-1 list-disc list-inside">
                      {(activeDailyInsights.self_reflection?.areas_to_improve || []).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 02: Interests & Hobbies */}
              <div className="pastel-card p-4 border-l-4" style={{ borderLeftColor: '#F2A477' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                    02 · Interests & Hobbies
                  </span>
                  <span className="text-xs">🎨</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(activeDailyInsights.interests_and_hobbies?.interests || []).map((interest, i) => {
                    const count = interestFreqMap[interest.toLowerCase()] || 1;
                    const isRecurring = count >= 2;
                    return (
                      <span
                        key={i}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                        style={{
                          backgroundColor: isRecurring ? 'var(--mood-pill)' : '#F1F5F9',
                          color: isRecurring ? 'var(--mood-dark)' : '#475569'
                        }}
                      >
                        <span>{interest}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/80">
                          {isRecurring ? `${count}x` : '1x'}
                        </span>
                      </span>
                    );
                  })}
                </div>
                <div className="rounded-2xl p-2.5 bg-orange-50/70 border border-orange-100">
                  <span className="text-[10px] font-extrabold uppercase text-orange-800 block mb-1">
                    🌱 Potensi Rutinitas
                  </span>
                  <ul className="text-[11px] font-medium text-orange-950 space-y-1 list-disc list-inside">
                    {(activeDailyInsights.interests_and_hobbies?.potential_hobbies || []).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 03: Dreams & Future Aspirations */}
              <div className="pastel-card p-4 border-l-4" style={{ borderLeftColor: '#83AEDD' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">
                    03 · Dreams & Future Aspirations
                  </span>
                  <span className="text-xs">🚀</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    ...(activeDailyInsights.future_aspirations?.dreams || []).map(t => ({ type: 'Impian', text: t })),
                    ...(activeDailyInsights.future_aspirations?.career_goals || []).map(t => ({ type: 'Karier', text: t })),
                    ...(activeDailyInsights.future_aspirations?.life_goals || []).map(t => ({ type: 'Hidup', text: t }))
                  ].map((item, i) => {
                    const cleanKey = item.text.replace(/\s*\(Kompas dari catatan sebelumnya\)/i, '').toLowerCase();
                    const count = dreamFreqMap[cleanKey] || 1;
                    const isCore = count >= 2;
                    return (
                      <div
                        key={i}
                        className="p-2.5 rounded-2xl bg-sky-50/75 border border-sky-100 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-sky-700">
                            {item.type}
                          </span>
                          <p className="text-xs font-bold text-slate-800">{item.text}</p>
                        </div>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                            isCore ? 'bg-sky-200/80 text-sky-900' : 'bg-slate-200/70 text-slate-600'
                          }`}
                        >
                          {isCore ? `Konsisten (${count}x)` : 'Baru 1x'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 04: Personal Growth & Next Steps */}
              <div
                className="p-4 rounded-[28px] text-white shadow-md"
                style={{ backgroundColor: 'var(--mood-dark)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/80">
                    04 · Personal Growth & Next Steps
                  </span>
                  <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    Rekomendasi AI Lokal
                  </span>
                </div>
                <div className="rounded-2xl bg-white/10 p-2.5 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/75 block mb-1">
                    💡 Inti Pelajaran
                  </span>
                  <ul className="text-[11px] text-white/95 space-y-1 list-disc list-inside">
                    {(activeDailyInsights.personal_growth?.lessons_learned || []).map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white text-slate-800 p-3">
                  <span
                    className="text-[10px] font-extrabold uppercase tracking-wider block mb-1"
                    style={{ color: 'var(--mood-dark)' }}
                  >
                    🎯 Langkah Kecil Besok
                  </span>
                  <ul className="text-[11px] font-bold space-y-1">
                    {(activeDailyInsights.personal_growth?.recommended_actions || []).map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span style={{ color: 'var(--mood-main)' }}>✔</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= VIEW 3: PROFILE / ARSIP BULANAN, TAHUNAN & SELF-DISCOVERY ================= */}
        {currentView === 'archive' && (
          <section className="flex-1 flex flex-col p-5 pb-28 overflow-y-auto">
            {/* Top Profile Card */}
            <div className="pastel-card p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl p-1 flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: 'var(--mood-card)' }}
                >
                  <CuteAnimal type={activeMood.animalType} sizeClass="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-extrabold text-slate-800">
                      <span>{userName}</span>'s Space
                    </h2>
                    <span
                      className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                    >
                      Dear Future Me
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Arsip Bulanan, Tahunan & Kesimpulan AI Lokal
                  </p>
                </div>
              </div>
              <button
                onClick={openSplashMoodScreen}
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Ganti Mood
              </button>
            </div>

            {/* Sub-View Switcher */}
            <div className="grid grid-cols-3 gap-2 bg-white/75 p-1.5 rounded-full mb-4 shadow-sm border border-white">
              {[
                { id: 'month', label: `Bulan (${currentMonthInfo.short})` },
                { id: 'year', label: `Tahun ${selectedYear}` },
                { id: 'board', label: 'Self-Discovery' }
              ].map(tab => {
                const active = archiveSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setArchiveSubTab(tab.id)}
                    className={`py-2 rounded-full text-xs transition ${
                      active
                        ? 'font-extrabold shadow-sm'
                        : 'font-semibold text-slate-500 hover:text-slate-800'
                    }`}
                    style={
                      active
                        ? { backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }
                        : {}
                    }
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* SUBVIEW A: BULAN INI (1-30 + RINGKASAN AI BULAN BERJALAN) */}
            {archiveSubTab === 'month' && (
              <div className="space-y-4">
                {/* Selector Bulan */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {MONTHS_INFO.map(m => {
                    const active = m.num === selectedMonth;
                    return (
                      <button
                        key={m.num}
                        onClick={() => {
                          setSelectedMonth(m.num);
                          if (selectedDay > m.days) setSelectedDay(m.days);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                          active ? 'text-white shadow-sm' : 'bg-white/80 text-slate-600'
                        }`}
                        style={active ? { backgroundColor: 'var(--mood-dark)' } : {}}
                      >
                        {m.short}
                      </button>
                    );
                  })}
                </div>

                {/* ★ RINGKASAN AI BULAN BERJALAN (MESKI BULAN BELUM BERAKHIR) ★ */}
                <div
                  className="p-4 rounded-[28px] text-white shadow-md"
                  style={{ backgroundColor: 'var(--mood-dark)' }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                      ✨ Ringkasan AI Bulan Berjalan
                    </span>
                    <span className="text-[11px] font-bold text-white/80">
                      {currentMonthEntries.length} Catatan di {currentMonthInfo.full}
                    </span>
                  </div>
                  <p className="text-xs text-white/95 leading-relaxed mt-2">
                    {monthlySynthesis.narrativeSummary}
                  </p>
                  {monthlySynthesis.strengthList.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/15 grid grid-cols-2 gap-2">
                      <div className="bg-white/10 rounded-2xl p-2.5">
                        <span className="text-[10px] font-extrabold uppercase text-white/75 block mb-1">
                          🌟 Pencapaian Bulan Ini
                        </span>
                        <ul className="text-[11px] space-y-0.5 list-disc list-inside text-white/95">
                          {monthlySynthesis.strengthList.slice(0, 2).map((s, idx) => (
                            <li key={idx} className="truncate">{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-2.5">
                        <span className="text-[10px] font-extrabold uppercase text-white/75 block mb-1">
                          🎯 Fokus Utama
                        </span>
                        <ul className="text-[11px] space-y-0.5 list-disc list-inside text-white/95">
                          {monthlySynthesis.sortedInterests.slice(0, 2).map((it, idx) => (
                            <li key={idx} className="truncate">{it.name} ({it.count}x)</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kalender Grid 1-30 */}
                <div className="pastel-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800">
                        {currentMonthInfo.full} {selectedYear} · Arsip {userName}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Klik tanggal 1–{currentMonthInfo.days} untuk melihat catatan & kesimpulan
                      </p>
                    </div>
                    <span
                      className="text-xs font-extrabold px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                    >
                      {currentMonthEntries.length} Jurnal
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: currentMonthInfo.days }, (_, i) => i + 1).map(d => {
                      const dKey = makeDateKey(selectedYear, selectedMonth, d);
                      const entry = journals[dKey];
                      const isSelected = d === selectedDay;
                      if (entry) {
                        const m = getMoodById(entry.moodId);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDay(d)}
                            className={`p-1.5 rounded-2xl flex flex-col items-center justify-between min-h-[64px] transition shadow-sm ${
                              isSelected ? 'ring-2 ring-slate-800 scale-105' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: m.cardBg }}
                          >
                            <span className="text-[10px] font-extrabold" style={{ color: m.darkText }}>
                              {d}
                            </span>
                            <div className="w-8 h-8">
                              <CuteAnimal type={m.animalType} sizeClass="w-8 h-8" />
                            </div>
                            <span
                              className="text-[8px] font-bold truncate w-full text-center"
                              style={{ color: m.darkText }}
                            >
                              {m.name}
                            </span>
                          </button>
                        );
                      }
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDay(d)}
                          className={`p-1.5 rounded-2xl flex flex-col items-center justify-between min-h-[64px] bg-slate-100/75 hover:bg-slate-200/70 transition ${
                            isSelected ? 'ring-2 ring-slate-700' : ''
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-400">{d}</span>
                          <span className="text-xs text-slate-300">+</span>
                          <span className="text-[8px] text-slate-400">Kosong</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Day Journal Preview Card */}
                <div className="pastel-card p-5">
                  {journals[currentDateKey] ? (
                    (() => {
                      const selEntry = journals[currentDateKey];
                      const m = getMoodById(selEntry.moodId);
                      const mMsg = MOOD_MESSAGES_COLLECTION[selEntry.moodId] || MOOD_MESSAGES_COLLECTION.in_love;
                      return (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-11 h-11 rounded-2xl p-1"
                                style={{ backgroundColor: m.cardBg }}
                              >
                                <CuteAnimal type={m.animalType} sizeClass="w-9 h-9" />
                              </div>
                              <div>
                                <span
                                  className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: m.pillBg, color: m.darkText }}
                                >
                                  {mMsg.symbol} {m.name}
                                </span>
                                <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">
                                  Jurnal {selectedDay} {currentMonthInfo.short} {selectedYear}
                                </h4>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMoodId(selEntry.moodId);
                                setCurrentView('journal');
                              }}
                              className="text-xs font-extrabold px-3 py-1.5 rounded-full text-white"
                              style={{ backgroundColor: m.darkText }}
                            >
                              Lihat & Edit
                            </button>
                          </div>
                          <p className="text-xs font-bold text-slate-700 mb-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            {selEntry.daily_insights?.self_reflection?.summary}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(selEntry.daily_insights?.interests_and_hobbies?.interests || []).map((t, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs font-bold text-slate-700">
                        Belum ada jurnal pada {selectedDay} {currentMonthInfo.full} {selectedYear}.
                      </p>
                      <button
                        type="button"
                        onClick={() => setCurrentView('journal')}
                        className="mt-3 px-4 py-2 rounded-full text-xs font-extrabold text-white shadow-sm"
                        style={{ backgroundColor: 'var(--mood-dark)' }}
                      >
                        + Tulis Jurnal {selectedDay} {currentMonthInfo.short}
                      </button>
                    </div>
                  )}
                </div>

                {/* Monthly General Mood Distribution Summary */}
                <div className="pastel-card p-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                    Distribusi Mood {currentMonthInfo.full} {selectedYear}
                  </h4>
                  {monthlySynthesis.sortedMoods.length > 0 ? (
                    <div className="space-y-2.5">
                      {monthlySynthesis.sortedMoods.map(({ mood: m, count }) => {
                        const totalLogged = Math.max(1, monthlySynthesis.totalEntries);
                        const pct = Math.round((count / totalLogged) * 100);
                        return (
                          <div key={m.id} className="flex items-center gap-2.5">
                            <div className="w-7 h-7 shrink-0">
                              <CuteAnimal type={m.animalType} sizeClass="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-700">
                                  {m.name} <span className="text-[10px] text-slate-400">({m.colorName})</span>
                                </span>
                                <span style={{ color: m.darkText }}>
                                  {count} hari ({pct}%)
                                </span>
                              </div>
                              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${pct}%`, backgroundColor: m.hex }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Belum ada distribusi mood tercatat di bulan ini.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* SUBVIEW B: TAHUN INI (REKAP 12 BULAN + RINGKASAN AI TAHUN BERJALAN) */}
            {archiveSubTab === 'year' && (
              <div className="space-y-4">
                {/* ★ RINGKASAN AI TAHUN BERJALAN (MESKI TAHUN BELUM BERAKHIR) ★ */}
                <div
                  className="p-5 rounded-[28px] text-white shadow-md"
                  style={{ backgroundColor: 'var(--mood-dark)' }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                      🌈 Ringkasan AI Tahun {selectedYear} (Berjalan)
                    </span>
                    <span className="text-xs font-bold text-white/85">
                      Total {currentYearEntries.length} Jurnal
                    </span>
                  </div>
                  <p className="text-xs text-white/95 leading-relaxed mt-2">
                    {yearlySynthesis.narrativeSummary}
                  </p>
                  {yearlySynthesis.lessonList.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/15">
                      <span className="text-[10px] font-extrabold uppercase text-white/75 block mb-1">
                        💡 Pelajaran Hidup Terpenting Tahun Ini:
                      </span>
                      <ul className="text-[11px] space-y-1 list-disc list-inside text-white/95">
                        {yearlySynthesis.lessonList.map((lesson, idx) => (
                          <li key={idx}>{lesson}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Grid 12 Bulan (Dihitung dari Data Jurnal Nyata + Bisa Diklik) */}
                <div className="pastel-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800">
                        Kilas Balik 12 Bulan · Tahun {selectedYear}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Sentuh bulan mana saja untuk membuka kalender & ringkasan bulan tersebut
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 mt-3">
                    {MONTHS_INFO.map(mInfo => {
                      const prefix = `${selectedYear}-${String(mInfo.num).padStart(2, '0')}-`;
                      const mEntries = Object.values(journals).filter(e =>
                        e.dateStr?.startsWith(prefix)
                      );
                      // Hitung mood dominan di bulan tersebut dari jurnal nyata
                      let domMoodId = 'neutral';
                      if (mEntries.length > 0) {
                        const counts = {};
                        mEntries.forEach(e => {
                          counts[e.moodId] = (counts[e.moodId] || 0) + 1;
                        });
                        domMoodId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
                      }
                      const mObj = getMoodById(domMoodId);

                      return (
                        <button
                          key={mInfo.num}
                          type="button"
                          onClick={() => {
                            setSelectedMonth(mInfo.num);
                            setSelectedDay(1);
                            setArchiveSubTab('month');
                          }}
                          className="p-3 rounded-2xl flex flex-col items-center text-center border border-white shadow-sm hover:scale-105 transition"
                          style={{
                            backgroundColor: mEntries.length > 0 ? mObj.cardBg : '#F1F5F9'
                          }}
                        >
                          <span
                            className="text-[11px] font-extrabold"
                            style={{ color: mEntries.length > 0 ? mObj.darkText : '#64748B' }}
                          >
                            {mInfo.short} {selectedYear}
                          </span>
                          <div className="w-10 h-10 my-1">
                            <CuteAnimal type={mObj.animalType} sizeClass="w-10 h-10" />
                          </div>
                          <span
                            className="text-[10px] font-bold"
                            style={{ color: mEntries.length > 0 ? mObj.darkText : '#94A3B8' }}
                          >
                            {mEntries.length > 0 ? mObj.name : 'Belum diisi'}
                          </span>
                          <span className="text-[9px] text-slate-600 mt-0.5">
                            {mEntries.length} catatan
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mood Dominan Sepanjang Tahun Berjalan */}
                <div className="pastel-card p-5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                    Mood Dominan Tahun {selectedYear} (Dari Catatanmu)
                  </h4>
                  <div className="space-y-2.5">
                    {yearlySynthesis.sortedMoods.map(({ mood: m, count }) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-2xl p-1 shrink-0"
                          style={{ backgroundColor: m.cardBg }}
                        >
                          <CuteAnimal type={m.animalType} sizeClass="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-800">
                              {m.name} · {m.colorName}
                            </span>
                            <span
                              className="text-xs font-extrabold"
                              style={{ color: m.darkText }}
                            >
                              {count} catatan
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Energi rata-rata mood ini: {m.energyScore}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBVIEW C: LONG-TERM SELF-DISCOVERY DASHBOARD */}
            {archiveSubTab === 'board' && (
              <div className="space-y-4">
                <div
                  className="p-5 rounded-[28px] text-white shadow-md"
                  style={{ backgroundColor: 'var(--mood-dark)' }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/75">
                    My Personal Growth Dashboard
                  </span>
                  <h3 className="font-serif-editorial text-xl font-bold mt-1">
                    Dear Future {userName} 💗
                  </h3>
                  <p className="text-xs text-white/85 mt-1 leading-relaxed">
                    Akumulasi minat, impian, dan pola dirimu yang diolah langsung dari {allTimeSynthesis.totalEntries} catatan jurnalmu.
                  </p>
                </div>

                <div className="pastel-card p-4">
                  <h4
                    className="text-xs font-extrabold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--mood-dark)' }}
                  >
                    1. My Recurring Interests
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-2.5">
                    Minat konsisten vs minat baru yang kamu tulis:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allTimeSynthesis.sortedInterests.map((item, i) => {
                      const isRecurring = item.count >= 2;
                      return (
                        <div
                          key={i}
                          className={`px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border ${
                            isRecurring
                              ? 'border-transparent shadow-sm'
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          style={
                            isRecurring
                              ? { backgroundColor: 'var(--mood-card)', color: 'var(--mood-dark)' }
                              : {}
                          }
                        >
                          <span className="text-xs font-extrabold">{item.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700">
                            {isRecurring ? `Konsisten (${item.count}x)` : '1x'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pastel-card p-4">
                  <h4
                    className="text-xs font-extrabold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--mood-dark)' }}
                  >
                    2. My Future Aspirations
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-2.5">
                    Cita-cita yang berulang kali tertulis di jurnalmu:
                  </p>
                  <div className="space-y-2">
                    {allTimeSynthesis.sortedDreams.map((d, i) => {
                      const isConsistent = d.count >= 2;
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-2xl flex items-center justify-between gap-2 ${
                            isConsistent
                              ? 'bg-emerald-50/70 border border-emerald-100'
                              : 'bg-slate-50 border border-slate-200/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center bg-white shadow-sm">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-xs font-extrabold text-slate-800">{d.name}</p>
                              <p className="text-[10px] text-slate-500">
                                {isConsistent ? 'Aspirasi konsisten' : 'Minat baru (1x)'}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                              isConsistent
                                ? 'bg-emerald-200/80 text-emerald-950'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {d.count}x
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pastel-card p-4">
                  <h4
                    className="text-xs font-extrabold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--mood-dark)' }}
                  >
                    3. Patterns to Pay Attention To
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {allTimeSynthesis.sortedPatterns.map((p, i) => (
                      <li
                        key={i}
                        className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between"
                      >
                        <span>• {p.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-900">
                          {p.count}x
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pastel-card p-4">
                  <h4
                    className="text-xs font-extrabold uppercase tracking-wider mb-2.5"
                    style={{ color: 'var(--mood-dark)' }}
                  >
                    4. Refleksi Perjalanan Hidup {userName}
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      {
                        q: 'Apa yang sering kupikirkan?',
                        a:
                          allTimeSynthesis.sortedInterests
                            .slice(0, 3)
                            .map(x => x.name)
                            .join(', ') || 'Pengembangan diri'
                      },
                      {
                        q: 'Apa impian utamaku?',
                        a:
                          allTimeSynthesis.sortedDreams
                            .slice(0, 2)
                            .map(x => x.name)
                            .join(' & ') || 'Terus bertumbuh'
                      },
                      {
                        q: 'Hal baik yang terakhir dicapai?',
                        a: allTimeSynthesis.strengthList[0] || 'Rutin menulis refleksi diri'
                      },
                      {
                        q: 'Pola yang perlu dijaga?',
                        a: allTimeSynthesis.sortedPatterns[0]?.name || 'Menjaga keseimbangan istirahat'
                      },
                      {
                        q: 'Apakah bergerak maju?',
                        a: `Ya, ${allTimeSynthesis.totalEntries} catatan menunjukkan progres nyata 💗`
                      }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                      >
                        <span
                          className="text-[11px] font-extrabold"
                          style={{ color: 'var(--mood-dark)' }}
                        >
                          {item.q}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700 text-right">
                          {item.a}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================= BOTTOM NAVBAR (3 ICON: HOME, + JOURNAL, PROFILE/ARSIP) ================= */}
        <div className="nav-bar-wrapper">
          <nav className="nav-bar-pill" aria-label="Navigasi Utama">
            <button
              type="button"
              onClick={() => {
                setSplashVisible(false);
                setCurrentView('home');
              }}
              className={`nav-item-btn ${currentView === 'home' ? 'active' : ''}`}
            >
              <div className="nav-bubble">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5.5v-6h-5v6H4a1 1 0 01-1-1v-9.5z" />
                </svg>
              </div>
              <span className="nav-label">Home</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSplashVisible(false);
                setCurrentView('journal');
              }}
              className={`nav-item-btn ${currentView === 'journal' ? 'active' : ''}`}
            >
              <div className="nav-bubble">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="nav-label">Journal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSplashVisible(false);
                setCurrentView('archive');
              }}
              className={`nav-item-btn ${currentView === 'archive' ? 'active' : ''}`}
            >
              <div className="nav-bubble">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="nav-label">{userName} & Arsip</span>
            </button>
          </nav>
        </div>

        {/* ================= MODAL: PROFIL LYA (FULL OFFLINE) ================= */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-800">
                  Profil Dear Future Me
                </h3>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Panggilanmu
                  </label>
                  <input
                    type="text"
                    value={inputUserName}
                    onChange={(e) => setInputUserName(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none"
                    placeholder="Lya"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <p className="text-[11px] font-bold text-slate-700">
                    🔒 100% Penyimpanan & AI NLP Lokal (Offline)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Seluruh catatan jurnal, 4 kesimpulan harian, serta ringkasan bulanan & tahunan diolah langsung di perangkatmu tanpa internet atau API eksternal.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (inputUserName.trim()) {
                      setUserName(inputUserName.trim());
                    }
                    setSettingsOpen(false);
                    showToast('Profil disimpan!');
                  }}
                  className="w-full py-3 rounded-full text-white text-xs font-extrabold shadow-md"
                  style={{ backgroundColor: 'var(--mood-dark)' }}
                >
                  Simpan Profil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xl">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
