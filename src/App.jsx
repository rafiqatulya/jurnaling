import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DEFAULT_MODEL,
  LITE_MODEL,
  generateDearlyAnalysis,
  computeLocalStats,
  testDearlyConnection
} from './smartEngine';

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
  { id: 'happy', name: 'Happy', petName: 'SUNNY CORGI', colorName: 'Butter yellow', hex: '#F5D778', softBg: '#FFFBEF', cardBg: '#FDF1C8', pillBg: '#FCE8A6', darkText: '#5C4308', accent: '#D49B1A', energyScore: 90, animalType: 'corgi' },
  { id: 'excited', name: 'Excited', petName: 'PEACHY FOX', colorName: 'Peach orange', hex: '#F2A477', softBg: '#FFF5EF', cardBg: '#FDE2D2', pillBg: '#FBD2BA', darkText: '#61290A', accent: '#D96B2B', energyScore: 95, animalType: 'fox' },
  { id: 'in_love', name: 'In Love', petName: 'UNI UNICORN', colorName: 'Dusty pink', hex: '#D98BAE', softBg: '#FCF2F7', cardBg: '#F6DCE8', pillBg: '#EFC9DB', darkText: '#591C39', accent: '#B85683', energyScore: 88, animalType: 'unicorn' },
  { id: 'peaceful', name: 'Peaceful', petName: 'DINO SAGE', colorName: 'Sage green', hex: '#8FB7A0', softBg: '#F2F8F4', cardBg: '#D9ECE1', pillBg: '#C6E2D2', darkText: '#1E4631', accent: '#4E8768', energyScore: 82, animalType: 'dino' },
  { id: 'sad', name: 'Sad', petName: 'BLUEY BUNNY', colorName: 'Soft blue', hex: '#83AEDD', softBg: '#F1F6FC', cardBg: '#D8E7F7', pillBg: '#C4DBF3', darkText: '#1A3B5C', accent: '#497FB8', energyScore: 38, animalType: 'bunny' },
  { id: 'lonely', name: 'Lonely', petName: 'LUNA KITTY', colorName: 'Lavender', hex: '#A99BD6', softBg: '#F5F3FB', cardBg: '#E4DFF4', pillBg: '#D4CCF0', darkText: '#32255E', accent: '#7360B5', energyScore: 42, animalType: 'kitty' },
  { id: 'angry', name: 'Angry', petName: 'PUFFY RED PANDA', colorName: 'Soft red', hex: '#E58A8E', softBg: '#FDF2F3', cardBg: '#F9DADC', pillBg: '#F4C5C8', darkText: '#611B1F', accent: '#C45459', energyScore: 45, animalType: 'redpanda' },
  { id: 'overwhelmed', name: 'Overwhelmed', petName: 'MOCHA OTTER', colorName: 'Warm taupe', hex: '#C49A80', softBg: '#FAF5F1', cardBg: '#EFE2D8', pillBg: '#E4D0C2', darkText: '#4F301D', accent: '#9C6B4E', energyScore: 35, animalType: 'otter' },
  { id: 'tired', name: 'Tired', petName: 'SLEEPY KOALA', colorName: 'Dusty blue-grey', hex: '#9BAFC1', softBg: '#F3F6F9', cardBg: '#DEE6EE', pillBg: '#CDD9E5', darkText: '#283A4A', accent: '#647F96', energyScore: 30, animalType: 'koala' },
  { id: 'neutral', name: 'Neutral', petName: 'MOCHI CAPYBARA', colorName: 'Warm grey', hex: '#B8B2A8', softBg: '#F6F5F3', cardBg: '#E8E5E0', pillBg: '#DAD5CE', darkText: '#3D3932', accent: '#857E73', energyScore: 65, animalType: 'capybara' },
  { id: 'hopeful', name: 'Hopeful', petName: 'GOLDIE DUCK', colorName: 'Warm gold', hex: '#D9B77B', softBg: '#FBF7F0', cardBg: '#F4E8D1', pillBg: '#EBD9B7', darkText: '#543A10', accent: '#B3863B', energyScore: 86, animalType: 'duck' },
  { id: 'anxious', name: 'Anxious', petName: 'BERRY HEDGEHOG', colorName: 'Muted purple', hex: '#B09BC1', softBg: '#F7F4F9', cardBg: '#E8DFEE', pillBg: '#DACCE4', darkText: '#3F2A4F', accent: '#836799', energyScore: 40, animalType: 'hedgehog' }
];

const MONTHS_INFO = [
  { num: 1, short: 'Jan', full: 'Januari' },
  { num: 2, short: 'Feb', full: 'Februari' },
  { num: 3, short: 'Mar', full: 'Maret' },
  { num: 4, short: 'Apr', full: 'April' },
  { num: 5, short: 'Mei', full: 'Mei' },
  { num: 6, short: 'Jun', full: 'Juni' },
  { num: 7, short: 'Jul', full: 'Juli' },
  { num: 8, short: 'Agu', full: 'Agustus' },
  { num: 9, short: 'Sep', full: 'September' },
  { num: 10, short: 'Okt', full: 'Oktober' },
  { num: 11, short: 'Nov', full: 'November' },
  { num: 12, short: 'Des', full: 'Desember' }
];

function getDaysInMonth(year, monthNum) {
  return new Date(year, monthNum, 0).getDate();
}

// ============================================================================
// 3. ILUSTRASI BINATANG 3D CLAY LUCU
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
    unicorn: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><ellipse cx="46" cy="40" rx="10" ry="16" transform="rotate(-18 46 40)" fill="#FFF5F8"/><ellipse cx="46" cy="41" rx="5" ry="10" transform="rotate(-18 46 41)" fill="#F4A2C0"/><ellipse cx="94" cy="40" rx="10" ry="16" transform="rotate(18 94 40)" fill="#FFF5F8"/><ellipse cx="94" cy="41" rx="5" ry="10" transform="rotate(18 94 41)" fill="#F4A2C0"/><path d="M70 11L61 38H79L70 11Z" fill="#FBBF24"/><path d="M64 29H76M66 21H74" stroke="#D97706" stroke-width="2" stroke-linecap="round"/><ellipse cx="70" cy="96" rx="34" ry="30" fill="#FFFFFF"/><ellipse cx="70" cy="96" rx="34" ry="30" fill="url(#clayShine)"/><rect x="38" y="34" width="64" height="56" rx="28" fill="#FFFFFF"/><rect x="38" y="34" width="64" height="56" rx="28" fill="url(#clayShine)"/><ellipse cx="70" cy="68" rx="20" ry="13" fill="#FAD2E4"/><circle cx="63" cy="67" r="2.2" fill="#9D4B6D"/><circle cx="77" cy="67" r="2.2" fill="#9D4B6D"/><circle cx="54" cy="52" r="4.2" fill="#1E293B"/><circle cx="52.8" cy="50.5" r="1.5" fill="#FFFFFF"/><circle cx="86" cy="52" r="4.2" fill="#1E293B"/><circle cx="84.8" cy="50.5" r="1.5" fill="#FFFFFF"/><ellipse cx="42" cy="96" rx="8" ry="12" transform="rotate(20 42 96)" fill="#F4A2C0"/><ellipse cx="98" cy="96" rx="8" ry="12" transform="rotate(-20 98 96)" fill="#F4A2C0"/><ellipse cx="55" cy="122" rx="10" ry="7" fill="#F4A2C0"/><ellipse cx="85" cy="122" rx="10" ry="7" fill="#F4A2C0"/></g></svg>`,
    corgi: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><path d="M35 22C29 24 28 45 36 54L56 42C50 28 41 20 35 22Z" fill="#F59E0B"/><path d="M105 22C111 24 112 45 104 54L84 42C90 28 99 20 105 22Z" fill="#F59E0B"/><path d="M38 29C35 31 35 43 40 49L51 41C47 33 41 28 38 29Z" fill="#FDE68A"/><path d="M102 29C105 31 105 43 100 49L89 41C93 33 99 28 102 29Z" fill="#FDE68A"/><ellipse cx="70" cy="96" rx="34" ry="29" fill="#F59E0B"/><ellipse cx="70" cy="98" rx="22" ry="23" fill="#FFFBEB"/><rect x="36" y="36" width="68" height="54" rx="27" fill="#F59E0B"/><rect x="36" y="36" width="68" height="54" rx="27" fill="url(#clayShine)"/><ellipse cx="70" cy="69" rx="22" ry="15" fill="#FFFBEB"/><rect x="65" y="42" width="10" height="22" rx="5" fill="#FFFBEB"/><ellipse cx="70" cy="64" rx="5.5" ry="4" fill="#1E293B"/><path d="M65 71Q70 76 75 71" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round"/><circle cx="52" cy="55" r="4.5" fill="#1E293B"/><circle cx="50.5" cy="53.5" r="1.6" fill="#FFFFFF"/><circle cx="88" cy="55" r="4.5" fill="#1E293B"/><circle cx="86.5" cy="53.5" r="1.6" fill="#FFFFFF"/><rect x="46" y="84" width="48" height="7" rx="3.5" fill="#EF4444"/><circle cx="70" cy="91" r="6" fill="#FBBF24" stroke="#B45309" stroke-width="1.5"/></g></svg>`,
    dino: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><circle cx="70" cy="24" r="7" fill="#FBBF24"/><circle cx="84" cy="29" r="6" fill="#FBBF24"/><circle cx="95" cy="40" r="5.5" fill="#FBBF24"/><ellipse cx="70" cy="96" rx="33" ry="29" fill="#84CC16"/><ellipse cx="67" cy="98" rx="21" ry="21" fill="#DCFCE7"/><rect x="37" y="30" width="64" height="56" rx="28" fill="#84CC16"/><rect x="37" y="30" width="64" height="56" rx="28" fill="url(#clayShine)"/><rect x="43" y="64" width="52" height="20" rx="10" fill="#A3E635"/><path d="M54 64V60L58 64M82 64V60L86 64" fill="#FFFFFF"/><circle cx="54" cy="48" r="6" fill="#FFFFFF"/><circle cx="55" cy="48" r="3.2" fill="#1E293B"/><circle cx="82" cy="48" r="6" fill="#FFFFFF"/><circle cx="81" cy="48" r="3.2" fill="#1E293B"/><ellipse cx="46" cy="58" rx="5" ry="3" fill="#F472B6" fill-opacity="0.5"/><ellipse cx="90" cy="58" rx="5" ry="3" fill="#F472B6" fill-opacity="0.5"/></g></svg>`,
    fox: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><path d="M34 24L42 54L62 38Z" fill="#FB923C"/><path d="M106 24L98 54L78 38Z" fill="#FB923C"/><ellipse cx="70" cy="96" rx="32" ry="28" fill="#FB923C"/><ellipse cx="70" cy="98" rx="20" ry="21" fill="#FFF7ED"/><rect x="36" y="36" width="68" height="52" rx="26" fill="#FB923C"/><rect x="36" y="36" width="68" height="52" rx="26" fill="url(#clayShine)"/><ellipse cx="70" cy="70" rx="24" ry="15" fill="#FFF7ED"/><circle cx="53" cy="55" r="4.3" fill="#1E293B"/><circle cx="87" cy="55" r="4.3" fill="#1E293B"/><circle cx="70" cy="65" r="4.5" fill="#1E293B"/><path d="M64 73Q70 78 76 73" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round"/></g></svg>`,
    bunny: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><ellipse cx="54" cy="28" rx="9" ry="22" fill="#BFDBFE"/><ellipse cx="54" cy="29" rx="4.5" ry="15" fill="#F4A2C0"/><ellipse cx="86" cy="28" rx="9" ry="22" fill="#BFDBFE"/><ellipse cx="86" cy="29" rx="4.5" ry="15" fill="#F4A2C0"/><ellipse cx="70" cy="97" rx="31" ry="27" fill="#DBEAFE"/><rect x="38" y="42" width="64" height="50" rx="25" fill="#DBEAFE"/><rect x="38" y="42" width="64" height="50" rx="25" fill="url(#clayShine)"/><circle cx="54" cy="63" r="4.2" fill="#1E3A8A"/><circle cx="86" cy="63" r="4.2" fill="#1E3A8A"/><ellipse cx="70" cy="68" rx="4" ry="3" fill="#F472B6"/><path d="M65 75Q70 71 75 75" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round"/><circle cx="48" cy="70" r="4" fill="#60A5FA" fill-opacity="0.6"/></g></svg>`,
    kitty: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><path d="M38 30L42 56L62 42Z" fill="#C4B5FD"/><path d="M102 30L98 56L78 42Z" fill="#C4B5FD"/><ellipse cx="70" cy="96" rx="31" ry="27" fill="#DDD6FE"/><rect x="38" y="40" width="64" height="50" rx="25" fill="#DDD6FE"/><rect x="38" y="40" width="64" height="50" rx="25" fill="url(#clayShine)"/><circle cx="54" cy="62" r="4.2" fill="#312E81"/><circle cx="86" cy="62" r="4.2" fill="#312E81"/><ellipse cx="70" cy="67" rx="3.8" ry="2.8" fill="#F472B6"/><path d="M64 73Q70 76 76 73" stroke="#312E81" stroke-width="2" stroke-linecap="round"/><path d="M67 47C67 44 71 43 73 46C70 46 69 49 72 51C69 51 67 49 67 47Z" fill="#FBBF24"/></g></svg>`,
    redpanda: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><circle cx="44" cy="40" r="12" fill="#FDA4AF"/><circle cx="96" cy="40" r="12" fill="#FDA4AF"/><ellipse cx="70" cy="96" rx="32" ry="27" fill="#F43F5E"/><rect x="36" y="38" width="68" height="52" rx="26" fill="#FB7185"/><rect x="36" y="38" width="68" height="52" rx="26" fill="url(#clayShine)"/><ellipse cx="53" cy="62" rx="10" ry="8" fill="#FFF1F2"/><ellipse cx="87" cy="62" rx="10" ry="8" fill="#FFF1F2"/><path d="M46 52L58 56M94 52L82 56" stroke="#881337" stroke-width="3" stroke-linecap="round"/><circle cx="54" cy="61" r="4" fill="#881337"/><circle cx="86" cy="61" r="4" fill="#881337"/><ellipse cx="70" cy="69" rx="14" ry="10" fill="#FFF1F2"/><circle cx="70" cy="66" r="3.8" fill="#881337"/></g></svg>`,
    otter: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><circle cx="42" cy="46" r="9" fill="#A87C5F"/><circle cx="98" cy="46" r="9" fill="#A87C5F"/><ellipse cx="70" cy="96" rx="32" ry="28" fill="#B98B6D"/><ellipse cx="70" cy="98" rx="20" ry="21" fill="#F5EBE1"/><rect x="38" y="38" width="64" height="52" rx="26" fill="#C49A80"/><rect x="38" y="38" width="64" height="52" rx="26" fill="url(#clayShine)"/><ellipse cx="70" cy="68" rx="20" ry="12" fill="#F5EBE1"/><circle cx="54" cy="55" r="4" fill="#291D16"/><circle cx="86" cy="55" r="4" fill="#291D16"/><ellipse cx="70" cy="64" rx="5" ry="3.5" fill="#432818"/><path d="M62 73C65 71 68 75 70 73C72 71 75 75 78 73" stroke="#432818" stroke-width="2" stroke-linecap="round"/></g></svg>`,
    koala: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><circle cx="36" cy="50" r="15" fill="#94A3B8"/><circle cx="36" cy="50" r="9" fill="#E2E8F0"/><circle cx="104" cy="50" r="15" fill="#94A3B8"/><circle cx="104" cy="50" r="9" fill="#E2E8F0"/><ellipse cx="70" cy="96" rx="31" ry="27" fill="#94A3B8"/><ellipse cx="70" cy="98" rx="19" ry="20" fill="#F1F5F9"/><rect x="38" y="38" width="64" height="52" rx="26" fill="#CBD5E1"/><rect x="38" y="38" width="64" height="52" rx="26" fill="url(#clayShine)"/><ellipse cx="70" cy="64" rx="8" ry="11" fill="#334155"/><path d="M48 56Q54 61 60 56M80 56Q86 61 92 56" stroke="#334155" stroke-width="2.4" stroke-linecap="round"/></g></svg>`,
    capybara: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><circle cx="70" cy="29" r="8" fill="#FB923C"/><path d="M70 21C72 18 76 19 75 22" stroke="#16A34A" stroke-width="2.2" stroke-linecap="round"/><circle cx="45" cy="42" r="8" fill="#8C7A6B"/><circle cx="95" cy="42" r="8" fill="#8C7A6B"/><ellipse cx="70" cy="96" rx="33" ry="28" fill="#A89888"/><rect x="37" y="36" width="66" height="54" rx="27" fill="#B8A99A"/><rect x="37" y="36" width="66" height="54" rx="27" fill="url(#clayShine)"/><ellipse cx="70" cy="67" rx="21" ry="14" fill="#9A8978"/><line x1="49" y1="54" x2="58" y2="54" stroke="#27272A" stroke-width="2.6" stroke-linecap="round"/><line x1="82" y1="54" x2="91" y2="54" stroke="#27272A" stroke-width="2.6" stroke-linecap="round"/><circle cx="64" cy="64" r="2.2" fill="#27272A"/><circle cx="76" cy="64" r="2.2" fill="#27272A"/></g></svg>`,
    duck: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><path d="M68 24C64 17 73 15 74 24" stroke="#FBBF24" stroke-width="4" stroke-linecap="round"/><ellipse cx="70" cy="96" rx="33" ry="28" fill="#FDE68A"/><rect x="39" y="36" width="62" height="52" rx="26" fill="#FEF08A"/><rect x="39" y="36" width="62" height="52" rx="26" fill="url(#clayShine)"/><ellipse cx="70" cy="66" rx="16" ry="8" fill="#FB923C"/><circle cx="54" cy="54" r="4.2" fill="#1E293B"/><circle cx="86" cy="54" r="4.2" fill="#1E293B"/><ellipse cx="47" cy="63" rx="5" ry="3" fill="#F472B6" fill-opacity="0.55"/><ellipse cx="93" cy="63" rx="5" ry="3" fill="#F472B6" fill-opacity="0.55"/></g></svg>`,
    hedgehog: `<svg class="${sizeClass}" viewBox="0 0 140 140" fill="none">${defs}<g filter="url(#softDrop)"><circle cx="70" cy="64" r="39" fill="#9378B0"/><ellipse cx="70" cy="97" rx="30" ry="26" fill="#E9D5FF"/><rect x="41" y="42" width="58" height="48" rx="24" fill="#F3E8FF"/><rect x="41" y="42" width="58" height="48" rx="24" fill="url(#clayShine)"/><circle cx="55" cy="62" r="4.2" fill="#3B0764"/><circle cx="85" cy="62" r="4.2" fill="#3B0764"/><circle cx="70" cy="67" r="4" fill="#581C87"/><path d="M64 74Q70 71 76 74" stroke="#581C87" stroke-width="2" stroke-linecap="round"/></g></svg>`
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
// 4. PENYIMPANAN PERMANEN LOKAL (HANYA DI MEMORI HP, NOL API KEY DI KODE)
// ============================================================================
const STORAGE_KEY = 'dearly_journal_data_v1';

// Migrasi otomatis model 2.5 lama yang sudah ditutup ke seri 3.8 terbaru
function migrateSavedModel(modelId) {
  if (!modelId || modelId === 'gemini-2.5-flash' || modelId === 'gemini-2.0-flash') {
    return DEFAULT_MODEL;
  }
  if (modelId === 'gemini-2.5-flash-lite' || modelId === 'gemini-2.0-flash-lite') {
    return LITE_MODEL;
  }
  return modelId;
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        selectedMoodId: parsed.selectedMoodId || 'in_love',
        userName: parsed.userName || 'Lya',
        apiKey: parsed.apiKey || '',
        selectedModel: migrateSavedModel(parsed.selectedModel),
        completedActions: parsed.completedActions || {},
        journals: parsed.journals && typeof parsed.journals === 'object' ? parsed.journals : {},
        monthlySummaries: parsed.monthlySummaries && typeof parsed.monthlySummaries === 'object' ? parsed.monthlySummaries : {},
        yearlySummaries: parsed.yearlySummaries && typeof parsed.yearlySummaries === 'object' ? parsed.yearlySummaries : {}
      };
    }
  } catch (err) {
    console.error('Error loading Dearly storage:', err);
  }

  return {
    selectedMoodId: 'in_love',
    userName: 'Lya',
    apiKey: '',
    selectedModel: DEFAULT_MODEL,
    completedActions: {},
    journals: {},
    monthlySummaries: {},
    yearlySummaries: {}
  };
}

function persistState(payload) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Error saving Dearly storage:', err);
  }
}

// ============================================================================
// 5. MAIN APPLICATION COMPONENT (`Dearly`)
// ============================================================================
export default function App() {
  const initialData = useMemo(() => loadInitialState(), []);
  const today = useMemo(() => new Date(), []);

  // Navigasi dengan transisi Fade-Out -> Fade-In
  const [currentView, setCurrentView] = useState('home');
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  // Splash Screen 3-Fase: 'idle' -> 'celebrating' -> 'exiting' -> 'hidden'
  const [splashPhase, setSplashPhase] = useState('idle');
  const [splashChosenMoodId, setSplashChosenMoodId] = useState(null);

  const [selectedMoodId, setSelectedMoodId] = useState(initialData.selectedMoodId);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [journalMode, setJournalMode] = useState('guided');
  const [homeSubTab, setHomeSubTab] = useState('aspirations');
  const [archiveSubTab, setArchiveSubTab] = useState('month');
  const [isFullWidthDesktop, setIsFullWidthDesktop] = useState(false);

  // Profil & Kunci Akses Lokal (tidak pernah hardcoded)
  const [userName, setUserName] = useState(initialData.userName);
  const [inputUserName, setInputUserName] = useState(initialData.userName);
  const [apiKey, setApiKey] = useState(initialData.apiKey);
  const [inputApiKey, setInputApiKey] = useState(initialData.apiKey);
  const [showKeyText, setShowKeyText] = useState(false);
  const [selectedModel, setSelectedModel] = useState(initialData.selectedModel);
  const [inputModel, setInputModel] = useState(initialData.selectedModel);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState('');

  // Data Jurnal & Ringkasan Bulanan / Tahunan
  const [completedActions, setCompletedActions] = useState(initialData.completedActions);
  const [journals, setJournals] = useState(initialData.journals);
  const [monthlySummaries, setMonthlySummaries] = useState(initialData.monthlySummaries);
  const [yearlySummaries, setYearlySummaries] = useState(initialData.yearlySummaries);

  const [seenMessageIndices, setSeenMessageIndices] = useState({});
  const [currentMessageIndexByMood, setCurrentMessageIndexByMood] = useState({ in_love: 2 });

  const [guidedForm, setGuidedForm] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [freeTextForm, setFreeTextForm] = useState('');

  const insightsSectionRef = useRef(null);
  const toastTimerRef = useRef(null);
  const splashTimersRef = useRef([]);

  const makeDateKey = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const makeMonthKey = (y, m) => `${y}-${String(m).padStart(2, '0')}`;
  const currentDateKey = makeDateKey(selectedYear, selectedMonth, selectedDay);
  const currentMonthKey = makeMonthKey(selectedYear, selectedMonth);
  const currentYearKey = String(selectedYear);
  const currentMonthInfo = MONTHS_INFO.find((m) => m.num === selectedMonth) || MONTHS_INFO[0];
  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);

  // Simpan seluruh state otomatis ke localStorage
  useEffect(() => {
    persistState({
      selectedMoodId,
      userName,
      apiKey,
      selectedModel,
      completedActions,
      journals,
      monthlySummaries,
      yearlySummaries
    });
  }, [selectedMoodId, userName, apiKey, selectedModel, completedActions, journals, monthlySummaries, yearlySummaries]);

  // Terapkan tema warna mood ke CSS Variables
  useEffect(() => {
    const mood = MOODS.find((m) => m.id === selectedMoodId) || MOODS[2];
    const root = document.documentElement;
    root.style.setProperty('--mood-main', mood.hex);
    root.style.setProperty('--mood-soft', mood.softBg);
    root.style.setProperty('--mood-card', mood.cardBg);
    root.style.setProperty('--mood-pill', mood.pillBg);
    root.style.setProperty('--mood-dark', mood.darkText);
    root.style.setProperty('--mood-accent', mood.accent);
  }, [selectedMoodId]);

  // Sinkronkan form ketika pindah tanggal
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
    }, 3400);
  };

  const getMoodById = (id) => MOODS.find((m) => m.id === id) || MOODS[2];

  const navigateToView = (targetView) => {
    if (targetView === currentView && splashPhase === 'hidden') return;
    if (splashPhase !== 'hidden') {
      setSplashPhase('hidden');
      setCurrentView(targetView);
      return;
    }
    setIsViewTransitioning(true);
    setTimeout(() => {
      setCurrentView(targetView);
      setIsViewTransitioning(false);
    }, 180);
  };

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
    setSeenMessageIndices((prev) => ({ ...prev, [moodId]: [...resetSeen, chosen] }));
    setCurrentMessageIndexByMood((prev) => ({ ...prev, [moodId]: chosen }));
    return chosen;
  };

  // Splash Screen: Pilih Mood -> Gelombang Warna Penuh + Grid Hilang + 1 Maskot Bouncing -> Fade-Out Masuk Beranda
  const handleSelectMoodFromSplash = (moodId) => {
    if (splashPhase !== 'idle') return;
    splashTimersRef.current.forEach(clearTimeout);
    splashTimersRef.current = [];

    setSplashChosenMoodId(moodId);
    setSelectedMoodId(moodId);
    setSplashPhase('celebrating');
    pickNonRepeatingMoodMessageIndex(moodId);

    const t1 = setTimeout(() => {
      setSplashPhase('exiting');
    }, 1150);

    const t2 = setTimeout(() => {
      setSplashPhase('hidden');
      setSplashChosenMoodId(null);
      setCurrentView('home');
    }, 1620);

    splashTimersRef.current.push(t1, t2);
  };

  const openSplashMoodScreen = () => {
    splashTimersRef.current.forEach(clearTimeout);
    splashTimersRef.current = [];
    setSplashChosenMoodId(null);
    setSplashPhase('idle');
  };

  const openSettingsModal = () => {
    setInputUserName(userName);
    setInputApiKey(apiKey);
    setInputModel(selectedModel);
    setShowKeyText(false);
    setTestResultMsg('');
    setSettingsOpen(true);
  };

  // Agregasi Statistik Lokal (0 Token)
  const allTimeStats = useMemo(
    () => computeLocalStats(Object.values(journals), MOODS),
    [journals]
  );

  const currentMonthEntries = useMemo(() => {
    const prefix = `${currentMonthKey}-`;
    return Object.values(journals).filter((e) => e.dateStr?.startsWith(prefix));
  }, [journals, currentMonthKey]);

  const monthlyStats = useMemo(
    () => computeLocalStats(currentMonthEntries, MOODS),
    [currentMonthEntries]
  );

  const currentYearEntries = useMemo(() => {
    const prefix = `${currentYearKey}-`;
    return Object.values(journals).filter((e) => e.dateStr?.startsWith(prefix));
  }, [journals, currentYearKey]);

  const yearlyStats = useMemo(
    () => computeLocalStats(currentYearEntries, MOODS),
    [currentYearEntries]
  );

  // ============================================================================
  // SATU-SATUNYA TEMPAT PEMANGGILAN API (ANTI-LOOPING, 1 KLIK = 1 CALL)
  // ============================================================================
  const handleSaveJournal = async () => {
    if (isSaving) return;

    const hasAnyText =
      Object.values(guidedForm).some((v) => v.trim().length > 0) || freeTextForm.trim().length > 0;

    if (!hasAnyText) {
      showToast('Tulis ceritamu dulu sebelum menyimpan ya 💗');
      return;
    }

    const moodObj = getMoodById(selectedMoodId);

    // 1. Amankan tulisan mentah & mood ke memori HP terlebih dahulu agar tidak pernah hilang
    const existingEntry = journals[currentDateKey];
    const baseEntry = {
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      dateStr: currentDateKey,
      moodId: selectedMoodId,
      guided: { ...guidedForm },
      freeText: freeTextForm,
      daily_insights: existingEntry?.daily_insights || null
    };

    const journalsWithDraft = {
      ...journals,
      [currentDateKey]: baseEntry
    };
    setJournals(journalsWithDraft);

    // Cek apakah API Key sudah diisi di menu Profil
    if (!apiKey.trim()) {
      showToast('Catatan tersimpan! Masukkan API Key di menu Profil untuk membuat ringkasan.');
      openSettingsModal();
      return;
    }

    setIsSaving(true);
    try {
      const topInt = allTimeStats.sortedInterests.slice(0, 4).map((x) => x.name).join(', ');
      const topDrm = allTimeStats.sortedDreams.slice(0, 3).map((x) => x.name).join(', ');
      const topHistoricalContext = [
        topInt ? `Minat berulang: ${topInt}` : '',
        topDrm ? `Impian berulang: ${topDrm}` : ''
      ]
        .filter(Boolean)
        .join('. ');

      const result = await generateDearlyAnalysis({
        apiKey,
        modelName: selectedModel,
        userName,
        dateLabel: `${selectedDay} ${currentMonthInfo.full} ${selectedYear}`,
        monthLabel: `${currentMonthInfo.full} ${selectedYear}`,
        yearLabel: String(selectedYear),
        moodName: moodObj.name,
        guidedInput: guidedForm,
        freeTextInput: freeTextForm,
        prevMonthlySummary: monthlySummaries[currentMonthKey] || '',
        prevYearlySummary: yearlySummaries[currentYearKey] || '',
        topHistoricalContext
      });

      const resolvedModel = result.usedModel || selectedModel;
      if (resolvedModel !== selectedModel) {
        setSelectedModel(resolvedModel);
      }

      const finalizedEntry = {
        ...baseEntry,
        daily_insights: result.daily_insights
      };

      const nextJournals = {
        ...journalsWithDraft,
        [currentDateKey]: finalizedEntry
      };
      const nextMonthlySummaries = result.monthly_summary
        ? { ...monthlySummaries, [currentMonthKey]: result.monthly_summary }
        : monthlySummaries;
      const nextYearlySummaries = result.yearly_summary
        ? { ...yearlySummaries, [currentYearKey]: result.yearly_summary }
        : yearlySummaries;

      setJournals(nextJournals);
      setMonthlySummaries(nextMonthlySummaries);
      setYearlySummaries(nextYearlySummaries);

      persistState({
        selectedMoodId,
        userName,
        apiKey,
        selectedModel: resolvedModel,
        completedActions,
        journals: nextJournals,
        monthlySummaries: nextMonthlySummaries,
        yearlySummaries: nextYearlySummaries
      });

      showToast(`Jurnal ${selectedDay} ${currentMonthInfo.short} tersimpan & dirangkum! ✨`);
      setTimeout(() => {
        insightsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } catch (err) {
      const msg = err?.message || 'Koneksi gagal';
      if (msg.startsWith('INVALID_KEY')) {
        showToast('API Key ditolak. Cek ulang di menu Profil.');
      } else if (msg.startsWith('RATE_LIMIT')) {
        showToast('Kuota gratis sementara penuh, tunggu 1 menit lalu coba lagi.');
      } else if (msg === 'PARSE_FAILED') {
        showToast('Format hasil tidak utuh. Tekan Simpan Jurnal sekali lagi.');
      } else {
        showToast(`Catatan tersimpan. Gagal merangkum: ${msg.slice(0, 75)}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJournalEntry = (dateKey) => {
    const nextJournals = { ...journals };
    delete nextJournals[dateKey];
    setJournals(nextJournals);
    setGuidedForm({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setFreeTextForm('');
    showToast('Catatan jurnal dihapus.');
  };

  const handleClearAllJournals = () => {
    setJournals({});
    setMonthlySummaries({});
    setYearlySummaries({});
    setCompletedActions({});
    setGuidedForm({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setFreeTextForm('');
    setSettingsOpen(false);
    showToast('Semua catatan dikosongkan permanen!');
  };

  const activeMoodIndex = MOODS.findIndex((m) => m.id === selectedMoodId);
  const activeMood = MOODS[activeMoodIndex >= 0 ? activeMoodIndex : 2];
  const buddyMood1 = MOODS[(activeMoodIndex + 1) % MOODS.length];
  const buddyMood2 = MOODS[(activeMoodIndex + 3) % MOODS.length];
  const activeMsgCollection = MOOD_MESSAGES_COLLECTION[selectedMoodId] || MOOD_MESSAGES_COLLECTION.in_love;
  const activeMsgIdx = currentMessageIndexByMood[selectedMoodId] ?? 0;
  const activeNoteMessage = activeMsgCollection.messages[activeMsgIdx] || activeMsgCollection.messages[0];

  const splashMoodObj = splashChosenMoodId ? getMoodById(splashChosenMoodId) : activeMood;
  const splashMsgCollection = MOOD_MESSAGES_COLLECTION[splashMoodObj.id] || MOOD_MESSAGES_COLLECTION.in_love;

  const interestFreqMap = useMemo(() => {
    const map = {};
    allTimeStats.sortedInterests.forEach((it) => {
      map[it.name.toLowerCase()] = it.count;
    });
    return map;
  }, [allTimeStats]);

  const dreamFreqMap = useMemo(() => {
    const map = {};
    allTimeStats.sortedDreams.forEach((d) => {
      map[d.name.toLowerCase()] = d.count;
    });
    return map;
  }, [allTimeStats]);

  const currentEntryInsights = journals[currentDateKey]?.daily_insights || null;

  const latestSavedEntry = useMemo(() => {
    if (journals[currentDateKey]?.daily_insights) return journals[currentDateKey];
    const allWithInsights = Object.values(journals)
      .filter((e) => e.daily_insights)
      .sort((a, b) => b.dateStr.localeCompare(a.dateStr));
    return allWithInsights[0] || null;
  }, [journals, currentDateKey]);

  const homeRecommendedActions = latestSavedEntry?.daily_insights?.personal_growth?.recommended_actions || [
    'Tulis jurnal singkat hari ini',
    'Pilih 1 prioritas utama untuk besok'
  ];

  const completedCount = homeRecommendedActions.filter((_, idx) => {
    const key = `${latestSavedEntry?.dateStr || currentDateKey}_${idx}`;
    return !!completedActions[key];
  }).length;

  const navIndex = currentView === 'home' ? 0 : currentView === 'journal' ? 1 : 2;

  const journeyDays = useMemo(() => {
    const endDay = Math.min(daysInSelectedMonth, Math.max(12, selectedDay));
    const startDay = Math.max(1, endDay - 11);
    const arr = [];
    for (let d = startDay; d <= endDay; d++) arr.push(d);
    return arr;
  }, [daysInSelectedMonth, selectedDay]);

  const isCustomFallbackModel = inputModel !== DEFAULT_MODEL && inputModel !== LITE_MODEL;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4">
      {/* Top Desktop Preview Controls */}
      <div className="w-full max-w-5xl mb-3 hidden sm:flex items-center justify-between bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-white">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--mood-main)' }} />
          <span className="font-bold text-slate-800 text-sm tracking-tight">
            Dearly · {userName}'s Journal
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
            onClick={() => setIsFullWidthDesktop((prev) => !prev)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {isFullWidthDesktop ? 'Tampilan: Lebar' : 'Tampilan: HP'}
          </button>
          <button
            onClick={openSettingsModal}
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
        className={`w-full ${isFullWidthDesktop ? 'max-w-3xl' : 'max-w-[440px]'} h-[100dvh] sm:h-[860px] sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-white relative overflow-hidden flex flex-col theme-transition`}
        style={{ backgroundColor: 'var(--mood-soft)' }}
      >
        {/* ================= SPLASH SCREEN: 1 FRAME PENUH TANPA SCROLL ================= */}
        {splashPhase !== 'hidden' && (
          <div
            className={`absolute inset-0 z-50 h-full w-full overflow-hidden flex flex-col justify-between px-5 py-6 splash-grey-pattern transition-all duration-500 ease-out ${
              splashPhase === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          >
            {splashPhase !== 'idle' && (
              <div
                className="splash-color-wave"
                style={{ backgroundColor: splashMoodObj.hex }}
              />
            )}

            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/35 pointer-events-none" />
            <div className="absolute bottom-20 -left-14 w-36 h-36 rounded-full bg-white/30 pointer-events-none" />

            {/* Top Brand Bar */}
            <div
              className={`relative z-10 flex items-center justify-between transition-all duration-400 ${
                splashPhase !== 'idle' ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white">
                <span className="text-xs">🐾</span>
                <span className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
                  DEARLY
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
                Hi, {userName} ✨
              </span>
            </div>

            {/* Greeting Singkat Tanpa Teks Panduan */}
            <div
              className={`relative z-10 text-center transition-all duration-400 ${
                splashPhase !== 'idle' ? 'opacity-0 -translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
              }`}
            >
              <p className="text-slate-500 text-[11px] font-extrabold uppercase tracking-widest">
                Welcome Back, {userName}
              </p>
              <h1 className="text-slate-800 text-[22px] font-extrabold tracking-tight leading-tight mt-0.5">
                How are you feeling today?
              </h1>
            </div>

            {/* Center Mascot Stage */}
            <div
              className={`relative z-20 flex flex-col items-center justify-center transition-all duration-500 ${
                splashPhase !== 'idle' ? 'flex-1 -mt-12 scale-110' : 'my-1'
              }`}
            >
              <div className="relative flex items-center justify-center">
                {splashPhase !== 'idle' && (
                  <>
                    <span className="absolute -top-5 -left-5 text-2xl animate-sparkle-pop">✨</span>
                    <span className="absolute -top-3 -right-6 text-xl animate-sparkle-pop">🌸</span>
                    <span className="absolute -bottom-3 -left-6 text-lg animate-sparkle-pop">🐾</span>
                    <span className="absolute -bottom-4 -right-5 text-xl animate-sparkle-pop">✨</span>
                  </>
                )}

                <div
                  className={`rounded-[34px] bg-white/85 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-lg transition-all duration-500 ${
                    splashPhase !== 'idle' ? 'w-44 h-44 animate-mascot-bounce' : 'w-28 h-28'
                  }`}
                >
                  <div className={splashPhase !== 'idle' ? 'w-32 h-32' : 'w-20 h-20 animate-float'}>
                    <CuteAnimal
                      type={splashMoodObj.animalType}
                      sizeClass={splashPhase !== 'idle' ? 'w-32 h-32' : 'w-20 h-20'}
                    />
                  </div>
                </div>
              </div>

              {splashPhase !== 'idle' && (
                <div className="text-center mt-5 px-4 animate-sparkle-pop">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/25 backdrop-blur-sm text-white text-[11px] font-extrabold tracking-widest uppercase mb-1.5">
                    {splashMsgCollection.symbol} {splashMoodObj.name}
                  </span>
                  <h2 className="text-2xl font-black text-white tracking-wider uppercase drop-shadow-sm">
                    {splashMoodObj.petName}
                  </h2>
                  <p className="text-white/95 text-xs font-semibold mt-1 max-w-[260px] mx-auto leading-relaxed">
                    {splashMsgCollection.tagline}
                  </p>
                </div>
              )}
            </div>

            {/* 12 Kategori Mood: 4x3 Pas 1 Layar (Tanpa Scroll) */}
            <div
              className={`relative z-10 bg-white/85 backdrop-blur-md rounded-[28px] p-2.5 border border-white shadow-sm transition-all duration-400 ease-in-out ${
                splashPhase !== 'idle'
                  ? 'opacity-0 translate-y-16 scale-90 pointer-events-none max-h-0 p-0 overflow-hidden border-0'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              <div className="grid grid-cols-4 gap-1.5">
                {MOODS.map((m) => {
                  const isSelected = m.id === selectedMoodId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMoodFromSplash(m.id)}
                      className="py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 bg-white hover:scale-105 active:scale-95 shadow-sm"
                      style={{ border: `2px solid ${isSelected ? m.hex : 'transparent'}` }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <CuteAnimal type={m.animalType} sizeClass="w-8 h-8" />
                      </div>
                      <span
                        className="text-[9.5px] font-extrabold mt-0.5 leading-tight text-center truncate w-full px-0.5"
                        style={{ color: m.darkText }}
                      >
                        {m.name}
                      </span>
                      <span
                        className="w-3.5 h-1 rounded-full mt-0.5"
                        style={{ backgroundColor: m.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= AREA KONTEN HALAMAN DENGAN EFEK FADE-IN / FADE-OUT ================= */}
        <div
          key={currentView}
          className={`flex-1 flex flex-col overflow-hidden ${
            isViewTransitioning ? 'page-exit' : 'page-enter'
          }`}
        >
          {/* ================= VIEW 1: HOME DASHBOARD ================= */}
          {currentView === 'home' && (
            <section className="flex-1 flex flex-col p-5 pb-36 overflow-y-auto">
              <div className="flex items-center justify-between pt-1 mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--mood-accent)' }}>
                    {selectedDay} {currentMonthInfo.full} {selectedYear}
                  </p>
                  <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5">
                    Hi, <span>{userName}</span> 👋🏼
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openSplashMoodScreen}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-white hover:scale-105 active:scale-95 transition"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      <CuteAnimal type={activeMood.animalType} sizeClass="w-5 h-5" />
                    </span>
                    <span className="text-xs font-extrabold" style={{ color: 'var(--mood-dark)' }}>
                      {activeMood.name}
                    </span>
                  </button>
                  <button
                    onClick={openSettingsModal}
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 relative hover:scale-105 active:scale-95 transition"
                    title="Profil & Pengaturan"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {!apiKey.trim() && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-2 right-2" />
                    )}
                  </button>
                </div>
              </div>

              {/* TOP HERO BANNER: "A LITTLE NOTE FOR YOU" */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-extrabold tracking-tight" style={{ color: 'var(--mood-dark)' }}>
                    Dearly · A Little Note for You
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
                      className="w-8 h-8 rounded-full bg-white/75 hover:bg-white flex items-center justify-center text-xs shadow-sm shrink-0 transition active:rotate-180"
                      style={{ color: 'var(--mood-dark)' }}
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
                        <span className="text-[10px] font-semibold opacity-75 block" style={{ color: 'var(--mood-dark)' }}>
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
                  onClick={() => navigateToView('journal')}
                  className="pastel-card p-4 flex flex-col justify-between min-h-[140px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition relative overflow-hidden"
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
                    navigateToView('journal');
                    setTimeout(() => {
                      insightsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 340);
                  }}
                  className="p-4 rounded-[28px] flex flex-col justify-between min-h-[140px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition text-white shadow-md relative overflow-hidden"
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

              {/* Mood Journey Bars */}
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
                        Tren suasana hati {currentMonthInfo.short} {selectedYear}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setArchiveSubTab('month');
                      navigateToView('archive');
                    }}
                    className="text-[11px] font-extrabold px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                  >
                    Kalender 1-{daysInSelectedMonth} →
                  </button>
                </div>
                <div className="h-24 flex items-end justify-between gap-1.5 pt-4 px-1">
                  {journeyDays.map((d) => {
                    const dKey = makeDateKey(selectedYear, selectedMonth, d);
                    const entry = journals[dKey];
                    const m = entry ? getMoodById(entry.moodId) : activeMood;
                    const heightPct = entry ? m.energyScore : 38;
                    const barColor = entry ? m.hex : '#CBD5E1';
                    return (
                      <div
                        key={d}
                        onClick={() => {
                          setSelectedDay(d);
                          navigateToView('journal');
                        }}
                        className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
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
                  ].map((t) => {
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
              <div key={homeSubTab} className="grid grid-cols-3 gap-2.5 mb-6 subtab-enter">
                {(() => {
                  const pastelBgSet = ['#F6DCE8', '#E2DCF8', '#D8ECE2'];
                  let items = [];
                  if (homeSubTab === 'aspirations') {
                    items = allTimeStats.sortedDreams.slice(0, 3).map((d, idx) => ({
                      title: d.name,
                      sub: `${d.count}x · ${d.count >= 2 ? 'Konsisten' : 'Baru 1x'}`,
                      icon: idx === 0 ? '🎓' : idx === 1 ? '💼' : '🌍',
                      bg: pastelBgSet[idx % 3]
                    }));
                  } else if (homeSubTab === 'interests') {
                    items = allTimeStats.sortedInterests.slice(0, 3).map((it, idx) => ({
                      title: it.name,
                      sub: `${it.count}x · ${it.count >= 2 ? 'Rutin' : 'Baru 1x'}`,
                      icon: idx === 0 ? '💻' : idx === 1 ? '🎸' : '✍️',
                      bg: pastelBgSet[idx % 3]
                    }));
                  } else {
                    items = allTimeStats.sortedPatterns.slice(0, 3).map((p, idx) => ({
                      title: p.name,
                      sub: `${p.count}x tercatat`,
                      icon: idx === 0 ? '🔋' : idx === 1 ? '💡' : '🕰️',
                      bg: pastelBgSet[idx % 3]
                    }));
                  }

                  if (items.length === 0) {
                    items = [
                      { title: 'Mulai Menulis', sub: 'Tulis jurnal pertamamu', icon: '✨', bg: pastelBgSet[0] },
                      { title: 'Kenali Diri', sub: 'Rangkuman otomatis', icon: '💗', bg: pastelBgSet[1] },
                      { title: 'Langkah Kecil', sub: 'Bertumbuh tiap hari', icon: '🌱', bg: pastelBgSet[2] }
                    ];
                  }

                  return items.map((card, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setArchiveSubTab('board');
                        navigateToView('archive');
                      }}
                      className="p-3.5 rounded-[24px] flex flex-col justify-between min-h-[118px] cursor-pointer hover:scale-[1.02] transition shadow-sm"
                      style={{ backgroundColor: card.bg }}
                    >
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-800 leading-snug line-clamp-3">
                          {card.title}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-600 mt-1">
                          {card.sub}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-2xl bg-white/75 flex items-center justify-center text-sm self-end mt-2 shadow-sm">
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
                        setCompletedActions((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className="pastel-card p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition"
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
                            className={`text-xs font-extrabold leading-snug ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {act}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {latestSavedEntry
                              ? `Rekomendasi jurnal ${latestSavedEntry.day} ${MONTHS_INFO[latestSavedEntry.month - 1]?.short || ''}`
                              : 'Siap menemani harimu'}
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

          {/* ================= VIEW 2: MY LITTLE DAILY JOURNAL (+) ================= */}
          {currentView === 'journal' && (
            <section className="flex-1 flex flex-col p-5 pb-36 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateToView('home')}
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 hover:scale-105 active:scale-95 transition"
                >
                  ←
                </button>
                <div className="text-center">
                  <h2 className="text-sm font-extrabold text-slate-800">Dearly Daily Journal</h2>
                  <p className="text-[11px] text-slate-500">Daily diary · Free writing</p>
                </div>
                <button
                  onClick={openSplashMoodScreen}
                  className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--mood-card)', color: 'var(--mood-dark)' }}
                >
                  <span>{activeMood.name}</span> 🎨
                </button>
              </div>

              {/* Date Picker Strip */}
              <div className="pastel-card p-3.5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      const newM = Number(e.target.value);
                      setSelectedMonth(newM);
                      const maxD = getDaysInMonth(selectedYear, newM);
                      if (selectedDay > maxD) setSelectedDay(maxD);
                    }}
                    className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full focus:outline-none"
                  >
                    {MONTHS_INFO.map((m) => (
                      <option key={m.num} value={m.num}>
                        {m.full} {selectedYear}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs font-extrabold" style={{ color: 'var(--mood-dark)' }}>
                    {selectedDay} {currentMonthInfo.short} {selectedYear}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((d) => {
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

              {/* Mode Switcher */}
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
                Tidak harus diisi semua—tulis senyamanmu, {userName} 💗
              </p>

              {/* Guided vs Free Writing */}
              <div key={journalMode} className="subtab-enter">
                {journalMode === 'guided' ? (
                  <div className="space-y-3 mb-4">
                    {[
                      { id: 'q1', label: '1. Hari ini aku merasa...', placeholder: 'Ceritakan perasaan dan energimu hari ini...' },
                      { id: 'q2', label: '2. Hal paling menyenangkan hari ini...', placeholder: 'Momen kecil atau pencapaian yang bikin tersenyum...' },
                      { id: 'q3', label: '3. Hal yang sedikit mengganggu pikiranku...', placeholder: 'Kekhawatiran, kelelahan, atau hal yang mengganjal...' },
                      { id: 'q4', label: '4. Satu hal yang aku syukuri...', placeholder: 'Hal sederhana yang membuatmu merasa cukup hari ini...' },
                      { id: 'q5', label: '5. Hal baru yang aku pikirkan atau pelajari hari ini...', placeholder: 'Ide, obrolan bermakna, atau pelajaran hidup...' },
                      { id: 'q6', label: '6. Sesuatu yang ingin aku coba jadikan hobi atau rutinitas...', placeholder: 'Contoh: gitar listrik, Pilates, menulis, membaca...' },
                      { id: 'q7', label: '7. Impian, cita-cita, atau kehidupan masa depan yang sempat aku bayangkan hari ini...', placeholder: 'Karier, S2, kemandirian finansial, bisnis sendiri...' },
                      { id: 'q8', label: '8. Besok aku ingin...', placeholder: 'Langkah kecil yang ingin dilakukan besok...' }
                    ].map((q) => (
                      <div key={q.id} className="pastel-card p-4">
                        <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--mood-dark)' }}>
                          {q.label}
                        </label>
                        <textarea
                          rows="2"
                          value={guidedForm[q.id]}
                          onChange={(e) => setGuidedForm((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          className="w-full text-xs leading-relaxed text-slate-700 bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 focus:outline-none focus:border-slate-400"
                          placeholder={q.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pastel-card p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--mood-dark)' }}>
                        Cerita Bebas Hari Ini
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Tulis panjang seperti diary biasa
                      </span>
                    </div>
                    <textarea
                      rows="10"
                      value={freeTextForm}
                      onChange={(e) => setFreeTextForm(e.target.value)}
                      className="w-full text-xs leading-relaxed text-slate-700 bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70 focus:outline-none focus:border-slate-400"
                      placeholder={`Ceritakan apa saja yang ${userName} alami, rasakan, pelajari, atau impikan hari ini...`}
                    />
                  </div>
                )}
              </div>

              {/* Save Button (Satu-satunya pemicu pemrosesan) */}
              <button
                onClick={handleSaveJournal}
                disabled={isSaving}
                className="w-full py-4 rounded-full text-white font-extrabold text-sm shadow-lg hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 mb-6 disabled:opacity-65"
                style={{ backgroundColor: 'var(--mood-dark)' }}
              >
                <span>{isSaving ? 'Menyimpan & Merangkum...' : 'Simpan Jurnal ✨'}</span>
              </button>

              {/* ================= 4 KESIMPULAN RINGKAS ================= */}
              <div ref={insightsSectionRef} className="space-y-3.5">
                <div className="px-1 flex items-center justify-between">
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                    >
                      Ringkasan Harian
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

                {!currentEntryInsights ? (
                  <div className="pastel-card p-6 text-center">
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                      Tulis catatanmu di atas lalu tekan <strong>Simpan Jurnal ✨</strong> untuk melihat 4 kesimpulan, serta pembaruan ringkasan bulanan & tahunanmu secara otomatis.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Card 01: Self Reflection */}
                    <div className="pastel-card p-4 border-l-4" style={{ borderLeftColor: 'var(--mood-main)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: 'var(--mood-accent)' }}>
                          01 · Self Reflection
                        </span>
                        <span className="text-xs">🪞</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed mb-2.5">
                        {currentEntryInsights.self_reflection?.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="rounded-2xl p-3 bg-emerald-50/75 border border-emerald-100">
                          <span className="text-[10px] font-extrabold uppercase text-emerald-800 block mb-1">
                            💪 Hal Baik
                          </span>
                          <ul className="text-[11px] leading-relaxed font-medium text-emerald-950 space-y-1.5 list-disc list-inside">
                            {(currentEntryInsights.self_reflection?.strengths || []).map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl p-3 bg-amber-50/80 border border-amber-100">
                          <span className="text-[10px] font-extrabold uppercase text-amber-800 block mb-1">
                            🔍 Perlu Diperhatikan
                          </span>
                          <ul className="text-[11px] leading-relaxed font-medium text-amber-950 space-y-1.5 list-disc list-inside">
                            {(currentEntryInsights.self_reflection?.areas_to_improve || []).map((a, i) => (
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
                        {(currentEntryInsights.interests_and_hobbies?.interests || []).map((interest, i) => {
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
                              <span className="text-[9px] px-1.5 rounded-full bg-white/80">
                                {isRecurring ? `${count}x` : '1x'}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                      <div className="rounded-2xl p-3 bg-orange-50/70 border border-orange-100">
                        <span className="text-[10px] font-extrabold uppercase text-orange-800 block mb-1">
                          🌱 Potensi Rutinitas
                        </span>
                        <ul className="text-[11px] leading-relaxed font-medium text-orange-950 space-y-1 list-disc list-inside">
                          {(currentEntryInsights.interests_and_hobbies?.potential_hobbies || []).map((h, i) => (
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
                        {(() => {
                          const list = [
                            ...(currentEntryInsights.future_aspirations?.dreams || []).map((t) => ({ type: 'Impian', text: t })),
                            ...(currentEntryInsights.future_aspirations?.career_goals || []).map((t) => ({ type: 'Karier', text: t })),
                            ...(currentEntryInsights.future_aspirations?.life_goals || []).map((t) => ({ type: 'Hidup', text: t }))
                          ];
                          if (list.length === 0) {
                            return (
                              <p className="text-xs text-slate-400">
                                Belum ada impian spesifik yang tertulis pada catatan hari ini.
                              </p>
                            );
                          }
                          return list.map((item, i) => {
                            const count = dreamFreqMap[item.text.toLowerCase()] || 1;
                            const isCore = count >= 2;
                            return (
                              <div
                                key={i}
                                className="p-2.5 rounded-2xl bg-sky-50/75 border border-sky-100 flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-sky-700 shrink-0">
                                    {item.type}
                                  </span>
                                  <p className="text-xs font-bold text-slate-800 leading-snug">{item.text}</p>
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
                          });
                        })()}
                      </div>
                    </div>

                    {/* Card 04: Personal Growth & Next Steps */}
                    <div className="p-4 rounded-[28px] text-white shadow-md" style={{ backgroundColor: 'var(--mood-dark)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/80">
                          04 · Personal Growth & Next Steps
                        </span>
                        <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                          Rekomendasi
                        </span>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3 mb-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/75 block mb-1">
                          💡 Inti Pelajaran
                        </span>
                        <ul className="text-[11px] leading-relaxed text-white/95 space-y-1.5 list-disc list-inside">
                          {(currentEntryInsights.personal_growth?.lessons_learned || []).map((l, i) => (
                            <li key={i}>{l}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl bg-white text-slate-800 p-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--mood-dark)' }}>
                          🎯 Langkah Kecil Besok
                        </span>
                        <ul className="text-[11px] leading-relaxed font-bold space-y-1.5">
                          {(currentEntryInsights.personal_growth?.recommended_actions || []).map((a, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span style={{ color: 'var(--mood-main)' }}>✔</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* ================= VIEW 3: PROFILE & ARSIP ================= */}
          {currentView === 'archive' && (
            <section className="flex-1 flex flex-col p-5 pb-36 overflow-y-auto">
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
                      <h2 className="text-base font-extrabold text-slate-800">{userName}'s Space</h2>
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                      >
                        Dearly
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Arsip Harian & Perkembangan Diri</p>
                  </div>
                </div>
                <button
                  onClick={openSettingsModal}
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  ⚙️ Profil
                </button>
              </div>

              {/* Sub-View Switcher */}
              <div className="grid grid-cols-3 gap-2 bg-white/75 p-1.5 rounded-full mb-4 shadow-sm border border-white">
                {[
                  { id: 'month', label: `Bulan (${currentMonthInfo.short})` },
                  { id: 'year', label: `Tahun ${selectedYear}` },
                  { id: 'board', label: 'Self-Discovery' }
                ].map((tab) => {
                  const active = archiveSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setArchiveSubTab(tab.id)}
                      className={`py-2 rounded-full text-xs transition ${
                        active ? 'font-extrabold shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-800'
                      }`}
                      style={active ? { backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' } : {}}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div key={archiveSubTab} className="subtab-enter">
                {/* SUBVIEW A: BULAN */}
                {archiveSubTab === 'month' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {MONTHS_INFO.map((m) => {
                        const active = m.num === selectedMonth;
                        return (
                          <button
                            key={m.num}
                            onClick={() => {
                              setSelectedMonth(m.num);
                              const maxD = getDaysInMonth(selectedYear, m.num);
                              if (selectedDay > maxD) setSelectedDay(maxD);
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

                    {/* Ringkasan Bulan Berjalan */}
                    <div className="p-4 rounded-[28px] text-white shadow-md" style={{ backgroundColor: 'var(--mood-dark)' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                          ✨ Ringkasan Bulan Berjalan
                        </span>
                        <span className="text-[11px] font-bold text-white/80">
                          {currentMonthEntries.length} Catatan di {currentMonthInfo.full}
                        </span>
                      </div>
                      <p className="text-xs text-white/95 leading-relaxed mt-2">
                        {monthlySummaries[currentMonthKey] ||
                          `Belum ada ringkasan untuk ${currentMonthInfo.full} ${selectedYear}. Ringkasan bulan berjalan akan terisi otomatis begitu kamu menyimpan catatan jurnal di bulan ini.`}
                      </p>
                      {monthlyStats.strengthList.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/15 grid grid-cols-2 gap-2">
                          <div className="bg-white/10 rounded-2xl p-2.5">
                            <span className="text-[10px] font-extrabold uppercase text-white/75 block mb-1">
                              🌟 Hal Baik Bulan Ini
                            </span>
                            <ul className="text-[11px] space-y-1 list-disc list-inside text-white/95">
                              {monthlyStats.strengthList.slice(0, 2).map((s, idx) => (
                                <li key={idx} className="line-clamp-2">{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white/10 rounded-2xl p-2.5">
                            <span className="text-[10px] font-extrabold uppercase text-white/75 block mb-1">
                              🎯 Fokus Utama
                            </span>
                            <ul className="text-[11px] space-y-1 list-disc list-inside text-white/95">
                              {monthlyStats.sortedInterests.slice(0, 2).map((it, idx) => (
                                <li key={idx} className="truncate">{it.name} ({it.count}x)</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pastel-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-800">
                            {currentMonthInfo.full} {selectedYear} · Arsip {userName}
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Pilih tanggal 1–{daysInSelectedMonth}
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
                        {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((d) => {
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
                                <span className="text-[10px] font-extrabold" style={{ color: m.darkText }}>{d}</span>
                                <div className="w-8 h-8">
                                  <CuteAnimal type={m.animalType} sizeClass="w-8 h-8" />
                                </div>
                                <span className="text-[8px] font-bold truncate w-full text-center" style={{ color: m.darkText }}>
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
                                  <div className="w-11 h-11 rounded-2xl p-1" style={{ backgroundColor: m.cardBg }}>
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
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteJournalEntry(currentDateKey)}
                                    className="text-[11px] font-bold px-2.5 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
                                  >
                                    Hapus
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedMoodId(selEntry.moodId);
                                      navigateToView('journal');
                                    }}
                                    className="text-xs font-extrabold px-3 py-1.5 rounded-full text-white"
                                    style={{ backgroundColor: m.darkText }}
                                  >
                                    Lihat & Edit
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs font-bold text-slate-700 leading-relaxed mb-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                {selEntry.daily_insights?.self_reflection?.summary ||
                                  'Catatan tersimpan. Buka lalu tekan Simpan Jurnal untuk melihat ringkasannya.'}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {(selEntry.daily_insights?.interests_and_hobbies?.interests || []).map((t, i) => (
                                  <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
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
                            onClick={() => navigateToView('journal')}
                            className="mt-3 px-4 py-2 rounded-full text-xs font-extrabold text-white shadow-sm"
                            style={{ backgroundColor: 'var(--mood-dark)' }}
                          >
                            + Tulis Jurnal {selectedDay} {currentMonthInfo.short}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUBVIEW B: TAHUN */}
                {archiveSubTab === 'year' && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-[28px] text-white shadow-md" style={{ backgroundColor: 'var(--mood-dark)' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                          🌈 Ringkasan Tahun {selectedYear} (Berjalan)
                        </span>
                        <span className="text-xs font-bold text-white/85">
                          Total {currentYearEntries.length} Jurnal
                        </span>
                      </div>
                      <p className="text-xs text-white/95 leading-relaxed mt-2">
                        {yearlySummaries[currentYearKey] ||
                          `Belum ada ringkasan tahun ${selectedYear}. Ringkasan tahun berjalan akan langsung terisi dan terus berkembang setiap kali kamu menyimpan jurnal.`}
                      </p>
                      {yearlyStats.lessonList.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/15">
                          <span className="text-[10px] font-extrabold uppercase text-white/75 block mb-1">
                            💡 Pelajaran Hidup Tahun Ini:
                          </span>
                          <ul className="text-[11px] leading-relaxed space-y-1 list-disc list-inside text-white/95">
                            {yearlyStats.lessonList.slice(0, 3).map((lesson, idx) => (
                              <li key={idx}>{lesson}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pastel-card p-5">
                      <h3 className="text-sm font-extrabold text-slate-800 mb-3">
                        Kilas Balik Mood Tahun {selectedYear}
                      </h3>
                      <div className="grid grid-cols-3 gap-2.5">
                        {MONTHS_INFO.map((mInfo) => {
                          const prefix = `${selectedYear}-${String(mInfo.num).padStart(2, '0')}-`;
                          const mEntries = Object.values(journals).filter((e) => e.dateStr?.startsWith(prefix));
                          let domMoodId = 'neutral';
                          if (mEntries.length > 0) {
                            const counts = {};
                            mEntries.forEach((e) => {
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
                              style={{ backgroundColor: mEntries.length > 0 ? mObj.cardBg : '#F1F5F9' }}
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
                                {mEntries.length > 0 ? mObj.name : 'Kosong'}
                              </span>
                              <span className="text-[9px] text-slate-600 mt-0.5">{mEntries.length} catatan</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBVIEW C: SELF-DISCOVERY BOARD */}
                {archiveSubTab === 'board' && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-[28px] text-white shadow-md" style={{ backgroundColor: 'var(--mood-dark)' }}>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/75">
                        My Personal Growth Dashboard
                      </span>
                      <h3 className="font-serif-editorial text-xl font-bold mt-1">
                        Dearly, {userName} 💗
                      </h3>
                      <p className="text-xs text-white/85 mt-1 leading-relaxed">
                        Akumulasi minat, impian, dan pola dirimu dari {allTimeStats.totalEntries} catatan jurnal.
                      </p>
                    </div>

                    <div className="pastel-card p-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'var(--mood-dark)' }}>
                        1. My Recurring Interests
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {allTimeStats.sortedInterests.length > 0 ? (
                          allTimeStats.sortedInterests.map((item, i) => {
                            const isRecurring = item.count >= 2;
                            return (
                              <div
                                key={i}
                                className={`px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border ${
                                  isRecurring ? 'border-transparent shadow-sm' : 'border-slate-200 bg-slate-50'
                                }`}
                                style={isRecurring ? { backgroundColor: 'var(--mood-card)', color: 'var(--mood-dark)' } : {}}
                              >
                                <span className="text-xs font-extrabold">{item.name}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700">
                                  {isRecurring ? `Konsisten (${item.count}x)` : '1x'}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-slate-400">Belum ada minat yang tercatat.</p>
                        )}
                      </div>
                    </div>

                    <div className="pastel-card p-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'var(--mood-dark)' }}>
                        2. My Future Aspirations
                      </h4>
                      <div className="space-y-2">
                        {allTimeStats.sortedDreams.length > 0 ? (
                          allTimeStats.sortedDreams.map((d, i) => {
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
                                  <span className="w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center bg-white shadow-sm shrink-0">
                                    {i + 1}
                                  </span>
                                  <p className="text-xs font-extrabold text-slate-800 leading-snug">{d.name}</p>
                                </div>
                                <span
                                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                                    isConsistent ? 'bg-emerald-200/80 text-emerald-950' : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {d.count}x
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-slate-400">Belum ada cita-cita yang tercatat.</p>
                        )}
                      </div>
                    </div>

                    <div className="pastel-card p-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'var(--mood-dark)' }}>
                        3. Patterns to Pay Attention To
                      </h4>
                      {allTimeStats.sortedPatterns.length > 0 ? (
                        <ul className="text-xs text-slate-700 space-y-1.5">
                          {allTimeStats.sortedPatterns.map((p, i) => (
                            <li
                              key={i}
                              className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between gap-2"
                            >
                              <span className="leading-snug">• {p.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-900 shrink-0">
                                {p.count}x
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400">Belum ada pola kendala yang tercatat.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* ================= SUPER-SMOOTH BOTTOM NAVBAR WITH GLIDING SCOOP ================= */}
        <div className="nav-bar-wrapper">
          <nav className="nav-bar-pill" aria-label="Navigasi Utama">
            <div
              className="nav-active-glider"
              style={{ transform: `translateX(${navIndex * 100}%)` }}
            >
              <div className="nav-active-circle" />
            </div>

            <button
              type="button"
              onClick={() => navigateToView('home')}
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
              onClick={() => navigateToView('journal')}
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
              onClick={() => navigateToView('archive')}
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

        {/* ================= MODAL: PROFIL & KONEKSI KUNCI AKSES ================= */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 subtab-enter">
            <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-slate-100 max-h-[90dvh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-800">Profil Dearly</h3>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Panggilanmu</label>
                  <input
                    type="text"
                    value={inputUserName}
                    onChange={(e) => setInputUserName(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none"
                    placeholder="Lya"
                  />
                </div>

                {/* Input API Key tersimpan HANYA di HP ini */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-800">
                      🔑 API Key (Tersimpan Lokal di HP)
                    </label>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        apiKey.trim()
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {apiKey.trim() ? 'Terpasang' : 'Belum diisi'}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showKeyText ? 'text' : 'password'}
                      value={inputApiKey}
                      onChange={(e) => setInputApiKey(e.target.value)}
                      className="w-full text-xs p-3 pr-14 rounded-2xl bg-white border border-slate-200 focus:outline-none font-mono"
                      placeholder="Tempel kunci API (gratis / berbayar)..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeyText((p) => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 px-2 py-1 rounded-lg bg-slate-100"
                    >
                      {showKeyText ? 'Tutup' : 'Lihat'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Pilihan Mesin Ringkasan
                    </label>
                    <select
                      value={inputModel}
                      onChange={(e) => setInputModel(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none font-semibold text-slate-700"
                    >
                      <option value={DEFAULT_MODEL}>Standar (Terbaru & Cerdas)</option>
                      <option value={LITE_MODEL}>Super Hemat (Paling Ringan)</option>
                      {isCustomFallbackModel && (
                        <option value={inputModel}>Otomatis ({inputModel})</option>
                      )}
                    </select>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Kunci hanya tersimpan di HP ini dan dipanggil tepat 1x setiap kamu menekan tombol Simpan Jurnal.
                  </p>

                  <button
                    type="button"
                    disabled={isTestingKey}
                    onClick={async () => {
                      setIsTestingKey(true);
                      setTestResultMsg('Menghubungkan...');
                      const res = await testDearlyConnection(inputApiKey, inputModel);
                      setTestResultMsg(res.message);
                      if (res.ok && res.usedModel) {
                        setInputModel(res.usedModel);
                      }
                      setIsTestingKey(false);
                    }}
                    className="w-full py-2 rounded-xl text-[11px] font-extrabold transition"
                    style={{ backgroundColor: 'var(--mood-pill)', color: 'var(--mood-dark)' }}
                  >
                    {isTestingKey ? 'Sedang Mengecek...' : 'Tes Koneksi'}
                  </button>

                  {testResultMsg && (
                    <p className="text-[10px] font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 leading-snug">
                      {testResultMsg}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    const nextName = inputUserName.trim() || userName;
                    const nextKey = inputApiKey.trim();
                    setUserName(nextName);
                    setApiKey(nextKey);
                    setSelectedModel(inputModel);
                    persistState({
                      selectedMoodId,
                      userName: nextName,
                      apiKey: nextKey,
                      selectedModel: inputModel,
                      completedActions,
                      journals,
                      monthlySummaries,
                      yearlySummaries
                    });
                    setSettingsOpen(false);
                    showToast('Pengaturan Dearly disimpan! ✨');
                  }}
                  className="w-full py-3 rounded-full text-white text-xs font-extrabold shadow-md"
                  style={{ backgroundColor: 'var(--mood-dark)' }}
                >
                  Simpan Pengaturan
                </button>

                <button
                  onClick={handleClearAllJournals}
                  className="w-full py-2.5 rounded-full text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition"
                >
                  Kosongkan Semua Catatan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xl text-center max-w-[90%] subtab-enter">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
