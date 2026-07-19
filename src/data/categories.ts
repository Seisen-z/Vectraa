/**
 * categories.ts
 * Defines the 20 browsing categories with metadata.
 */

export interface Category {
  /** Unique key used in icon entries */
  id: string;
  /** Display label */
  label: string;
  /** Emoji icon for the sidebar */
  emoji: string;
  /** Short description */
  description: string;
  /** Associated keyword tags for icon assignment */
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    label: 'All Icons',
    emoji: '✦',
    description: 'Browse the full icon library',
    keywords: [],
  },
  {
    id: 'technology',
    label: 'Technology',
    emoji: '💻',
    description: 'Devices, code, and computing',
    keywords: ['computer', 'device', 'code', 'cpu', 'server', 'network', 'chip', 'battery', 'monitor', 'keyboard', 'mouse', 'usb', 'wifi', 'bluetooth', 'terminal', 'git', 'database', 'cloud', 'api', 'bug', 'laptop', 'desktop', 'tablet', 'phone', 'printer', 'scanner', 'router', 'cable', 'plugin', 'sdk'],
  },
  {
    id: 'communication',
    label: 'Communication',
    emoji: '💬',
    description: 'Messaging, calls, and notifications',
    keywords: ['message', 'chat', 'mail', 'email', 'phone', 'call', 'video', 'notification', 'bell', 'inbox', 'send', 'reply', 'forward', 'mention', 'comment', 'speech', 'bubble', 'voice', 'microphone', 'headphone', 'broadcast', 'rss', 'subscribe', 'contact', 'address'],
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    emoji: '📊',
    description: 'Charts, graphs, and analytics',
    keywords: ['chart', 'graph', 'bar', 'pie', 'line', 'analytics', 'data', 'statistics', 'report', 'dashboard', 'metric', 'trend', 'increase', 'decrease', 'pulse', 'activity', 'histogram', 'scatter', 'table', 'spreadsheet', 'formula', 'calculation', 'filter', 'sort', 'export', 'import'],
  },
  {
    id: 'ui-controls',
    label: 'UI / UX Controls',
    emoji: '🎛',
    description: 'Buttons, forms, and interface elements',
    keywords: ['button', 'toggle', 'switch', 'slider', 'input', 'checkbox', 'radio', 'dropdown', 'menu', 'modal', 'tooltip', 'tab', 'panel', 'grid', 'list', 'card', 'form', 'select', 'close', 'open', 'expand', 'collapse', 'drag', 'resize', 'scroll', 'zoom', 'pin', 'cursor', 'pointer'],
  },
  {
    id: 'weather',
    label: 'Weather',
    emoji: '🌤',
    description: 'Sun, rain, clouds, and conditions',
    keywords: ['sun', 'cloud', 'rain', 'snow', 'wind', 'storm', 'thunder', 'lightning', 'fog', 'haze', 'rainbow', 'umbrella', 'temperature', 'hot', 'cold', 'weather', 'climate', 'forecast', 'drizzle', 'blizzard', 'tornado', 'hurricane', 'moon', 'stars', 'sunrise', 'sunset'],
  },
  {
    id: 'emotions',
    label: 'Emotions & People',
    emoji: '😊',
    description: 'Faces, expressions, and people',
    keywords: ['happy', 'sad', 'angry', 'smile', 'laugh', 'cry', 'face', 'person', 'user', 'group', 'team', 'friend', 'love', 'heart', 'emoji', 'mood', 'expression', 'gesture', 'hand', 'thumbs', 'wave', 'hug', 'kiss', 'wink', 'surprised'],
  },
  {
    id: 'shopping',
    label: 'Shopping & E-Commerce',
    emoji: '🛒',
    description: 'Carts, payments, and purchases',
    keywords: ['cart', 'bag', 'shop', 'store', 'buy', 'sell', 'payment', 'card', 'wallet', 'price', 'tag', 'discount', 'coupon', 'receipt', 'order', 'delivery', 'shipping', 'package', 'gift', 'barcode', 'qr', 'checkout', 'refund', 'wishlist', 'favourite'],
  },
  {
    id: 'social-media',
    label: 'Social Media',
    emoji: '📱',
    description: 'Social platforms and sharing',
    keywords: ['social', 'share', 'like', 'follow', 'profile', 'feed', 'post', 'story', 'reel', 'live', 'hashtag', 'trending', 'viral', 'subscribe', 'comment', 'react', 'community', 'forum', 'blog', 'podcast'],
  },
  {
    id: 'brands',
    label: 'Brands & Logos',
    emoji: '🏢',
    description: 'Company logos and popular brands',
    keywords: ['brand', 'logo', 'company', 'trademark', 'social', 'facebook', 'twitter', 'youtube', 'tiktok', 'instagram', 'github', 'google', 'apple', 'microsoft'],
  },
  {
    id: 'arrows',
    label: 'Arrows & Navigation',
    emoji: '➡',
    description: 'Directional arrows and navigation',
    keywords: ['arrow', 'navigate', 'direction', 'up', 'down', 'left', 'right', 'back', 'forward', 'refresh', 'rotate', 'flip', 'swap', 'move', 'drag', 'return', 'redo', 'undo', 'next', 'previous', 'first', 'last', 'home', 'breadcrumb', 'path', 'route', 'cursor'],
  },
  {
    id: 'file-types',
    label: 'File Types',
    emoji: '📄',
    description: 'Documents, files, and formats',
    keywords: ['file', 'document', 'pdf', 'doc', 'xls', 'ppt', 'txt', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts', 'image', 'audio', 'video', 'zip', 'folder', 'attach', 'upload', 'download', 'copy', 'paste', 'save', 'open'],
  },
  {
    id: 'security',
    label: 'Security',
    emoji: '🔒',
    description: 'Privacy, encryption, and protection',
    keywords: ['lock', 'unlock', 'key', 'password', 'security', 'shield', 'firewall', 'vpn', 'encrypt', 'decrypt', 'fingerprint', 'face-id', 'auth', 'token', 'certificate', 'privacy', 'hack', 'bug', 'virus', 'scan', 'verify', 'badge', 'admin', 'permission', 'access', 'ban'],
  },
  {
    id: 'medical',
    label: 'Medical & Health',
    emoji: '🏥',
    description: 'Health, medicine, and wellness',
    keywords: ['health', 'medical', 'hospital', 'doctor', 'medicine', 'pill', 'syringe', 'heart', 'pulse', 'blood', 'dna', 'microscope', 'stethoscope', 'bandage', 'first-aid', 'ambulance', 'pharmacy', 'wellness', 'fitness', 'exercise', 'brain', 'eye', 'ear', 'tooth'],
  },
  {
    id: 'travel',
    label: 'Travel & Transport',
    emoji: '✈',
    description: 'Vehicles, places, and destinations',
    keywords: ['travel', 'plane', 'car', 'train', 'bus', 'bike', 'ship', 'rocket', 'helicopter', 'taxi', 'map', 'location', 'gps', 'route', 'compass', 'hotel', 'passport', 'luggage', 'beach', 'mountain', 'city', 'globe', 'world', 'trip', 'journey', 'road'],
  },
  {
    id: 'business',
    label: 'Business & Finance',
    emoji: '💼',
    description: 'Work, money, and corporate',
    keywords: ['business', 'office', 'work', 'money', 'finance', 'bank', 'currency', 'dollar', 'euro', 'profit', 'loss', 'investment', 'growth', 'meeting', 'presentation', 'briefcase', 'contract', 'signature', 'company', 'employee', 'salary', 'tax', 'budget', 'expense', 'invoice'],
  },
  {
    id: 'food-drink',
    label: 'Food & Drink',
    emoji: '🍕',
    description: 'Cuisine, beverages, and dining',
    keywords: ['food', 'drink', 'eat', 'cook', 'restaurant', 'coffee', 'tea', 'water', 'beer', 'wine', 'pizza', 'burger', 'cake', 'fruit', 'vegetable', 'meat', 'bread', 'plate', 'fork', 'knife', 'spoon', 'cup', 'glass', 'bottle', 'kitchen', 'chef', 'recipe'],
  },
  {
    id: 'nature',
    label: 'Nature & Environment',
    emoji: '🌿',
    description: 'Plants, animals, and ecology',
    keywords: ['nature', 'tree', 'flower', 'leaf', 'plant', 'animal', 'cat', 'dog', 'bird', 'fish', 'insect', 'forest', 'mountain', 'ocean', 'river', 'earth', 'eco', 'green', 'recycle', 'sustainability', 'environment', 'wildlife', 'garden', 'seed', 'growth'],
  },
  {
    id: 'education',
    label: 'Education',
    emoji: '🎓',
    description: 'Learning, school, and knowledge',
    keywords: ['school', 'book', 'learn', 'study', 'education', 'graduation', 'diploma', 'pencil', 'pen', 'notebook', 'classroom', 'teacher', 'student', 'library', 'exam', 'quiz', 'knowledge', 'science', 'math', 'language', 'art', 'music', 'history', 'geography'],
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    emoji: '♿',
    description: 'Inclusive design and accessibility',
    keywords: ['accessibility', 'disability', 'wheelchair', 'blind', 'deaf', 'hearing', 'visual', 'braille', 'sign', 'language', 'contrast', 'focus', 'keyboard', 'screen', 'reader', 'caption', 'subtitle', 'inclusive', 'universal', 'aid'],
  },
  {
    id: 'sports',
    label: 'Sports & Recreation',
    emoji: '⚽',
    description: 'Athletics, games, and leisure',
    keywords: ['sport', 'football', 'soccer', 'basketball', 'tennis', 'baseball', 'golf', 'swim', 'run', 'gym', 'fitness', 'trophy', 'medal', 'game', 'play', 'team', 'competition', 'training', 'athlete', 'court', 'field', 'race', 'cycling', 'hiking', 'yoga'],
  },
  {
    id: 'roles',
    label: 'User Roles & Staff',
    emoji: '👥',
    description: 'Admin, support, staff, and user levels',
    keywords: ['role', 'user', 'admin', 'support', 'staff', 'manager', 'owner', 'guest', 'member', 'moderator', 'agent', 'client', 'customer', 'employee', 'boss', 'team', 'group', 'vip', 'superadmin'],
  },
  {
    id: 'unique',
    label: 'Unique & Abstract',
    emoji: '✨',
    description: 'Random, unique, and abstract shapes',
    keywords: ['unique', 'random', 'abstract', 'shape', 'weird', 'misc', 'creative', 'art', 'pattern', 'geometry'],
  },
];

/** Map for O(1) category lookup */
export const CATEGORY_MAP = new Map(CATEGORIES.map(c => [c.id, c]));

/** Category ids in fallback distribution order (skips 'all', 'unique', and 'badges'). */
const FALLBACK_CATEGORY_IDS = CATEGORIES.map(c => c.id).filter(id => id !== 'all' && id !== 'unique' && id !== 'badges');

/**
 * Assigns a category to an icon name by matching against each category's
 * `keywords`. Falls back to a deterministic hash-based distribution across
 * categories when no keyword matches, so uncategorized icons still spread
 * evenly instead of piling into one bucket.
 */
export function categorizeByKeywords(name: string): string {
  const n = name.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    if (cat.keywords.some(kw => n.includes(kw))) return cat.id;
  }
  let hash = 0;
  for (let i = 0; i < n.length; i++) hash += n.charCodeAt(i);
  return FALLBACK_CATEGORY_IDS[hash % FALLBACK_CATEGORY_IDS.length];
}
