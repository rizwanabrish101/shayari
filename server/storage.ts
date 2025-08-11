import { type Poet, type Category, type Shayari, type Favorite, type InsertPoet, type InsertCategory, type InsertShayari, type InsertFavorite, type ShayariWithPoet } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Poets
  getPoets(): Promise<Poet[]>;
  getPoet(id: string): Promise<Poet | undefined>;
  createPoet(poet: InsertPoet): Promise<Poet>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Shayaris
  getShayaris(): Promise<ShayariWithPoet[]>;
  getShayarisByPoet(poetId: string): Promise<ShayariWithPoet[]>;
  getShayarisByCategory(categoryId: string): Promise<ShayariWithPoet[]>;
  getFeaturedShayari(): Promise<ShayariWithPoet | undefined>;
  searchShayaris(query: string): Promise<ShayariWithPoet[]>;
  getShayari(id: string): Promise<ShayariWithPoet | undefined>;
  createShayari(shayari: InsertShayari): Promise<Shayari>;

  // Favorites
  getFavorites(): Promise<ShayariWithPoet[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(shayariId: string): Promise<boolean>;
  isFavorite(shayariId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private poets: Map<string, Poet> = new Map();
  private categories: Map<string, Category> = new Map();
  private shayaris: Map<string, Shayari> = new Map();
  private favorites: Map<string, Favorite> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize poets
    const poetsData: Poet[] = [
      {
        id: "iqbal",
        name: "Allama Iqbal",
        urduName: "علامہ اقبال",
        title: "Poet of the East",
        urduTitle: "شاعر مشرق",
        birthYear: 1877,
        deathYear: 1938,
        biography: "Sir Muhammad Iqbal was a philosopher, poet, lawyer, politician, and scholar.",
        urduBiography: "سر محمد اقبال ایک فلسفی، شاعر، وکیل، سیاست دان اور عالم تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "ghalib",
        name: "Mirza Ghalib",
        urduName: "مرزا غالب",
        title: "Master of Poetry",
        urduTitle: "استاد شعر",
        birthYear: 1797,
        deathYear: 1869,
        biography: "Mirza Asadullah Khan Ghalib was a prominent Urdu and Persian poet.",
        urduBiography: "مرزا اسد اللہ خان غالب ایک مشہور اردو اور فارسی شاعر تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "faiz",
        name: "Faiz Ahmed Faiz",
        urduName: "فیض احمد فیض",
        title: "Poet of Revolution",
        urduTitle: "شاعر انقلاب",
        birthYear: 1911,
        deathYear: 1984,
        biography: "Faiz Ahmed Faiz was a Pakistani poet and author in Urdu and Punjabi.",
        urduBiography: "فیض احمد فیض ایک پاکستانی شاعر اور اردو اور پنجابی میں مصنف تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "josh",
        name: "Josh Malihabadi",
        urduName: "جوش ملیح آبادی",
        title: "Poet of Emotions",
        urduTitle: "شاعر جذبات",
        birthYear: 1898,
        deathYear: 1982,
        biography: "Josh Malihabadi was one of the finest Urdu poets of the 20th century.",
        urduBiography: "جوش ملیح آبادی بیسویں صدی کے بہترین اردو شعراء میں سے ایک تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "saghar",
        name: "Saghar Siddiqui",
        urduName: "ساغر صدیقی",
        title: "Poet of Sorrow",
        urduTitle: "شاعر غم",
        birthYear: 1928,
        deathYear: 1974,
        biography: "Saghar Siddiqui was a renowned Urdu poet known for his melancholic poetry.",
        urduBiography: "ساغر صدیقی ایک مشہور اردو شاعر تھے جو اپنی اداس شاعری کے لیے جانے جاتے تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "faraz",
        name: "Ahmad Faraz",
        urduName: "احمد فراز",
        title: "Poet of Love",
        urduTitle: "شاعر محبت",
        birthYear: 1931,
        deathYear: 2008,
        biography: "Ahmad Faraz was a Pakistani Urdu poet famous for his romantic poetry.",
        urduBiography: "احمد فراز ایک پاکستانی اردو شاعر تھے جو اپنی رومانی شاعری کے لیے مشہور تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "meer",
        name: "Meer Taqi Meer",
        urduName: "میر تقی میر",
        title: "God of Poetry",
        urduTitle: "خدائے شعر",
        birthYear: 1723,
        deathYear: 1810,
        biography: "Mir Taqi Mir was a prominent classical Urdu poet.",
        urduBiography: "میر تقی میر ایک مشہور کلاسیکی اردو شاعر تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "zauq",
        name: "Ibrahim Zauq",
        urduName: "ابراہیم ذوق",
        title: "Royal Poet",
        urduTitle: "شاہی شاعر",
        birthYear: 1789,
        deathYear: 1854,
        biography: "Ibrahim Zauq was a classical Urdu poet and the royal poet of Mughal emperor Bahadur Shah Zafar.",
        urduBiography: "ابراہیم ذوق ایک کلاسیکی اردو شاعر اور مغل شہنشاہ بہادر شاہ ظفر کے دربارी شاعر تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "momin",
        name: "Momin Khan Momin",
        urduName: "مومن خان مومن",
        title: "Prince of Ghazal",
        urduTitle: "شہزادہ غزل",
        birthYear: 1800,
        deathYear: 1851,
        biography: "Momin Khan Momin was a distinguished Urdu poet known for his ghazals.",
        urduBiography: "مومن خان مومن ایک ممتاز اردو شاعر تھے جو اپنی غزلوں کے لیے مشہور تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "dagh",
        name: "Dagh Dehlvi",
        urduName: "داغ دہلوی",
        title: "Master of Urdu",
        urduTitle: "استاد اردو",
        birthYear: 1831,
        deathYear: 1905,
        biography: "Dagh Dehlvi was a renowned Urdu poet and teacher.",
        urduBiography: "داغ دہلوی ایک مشہور اردو شاعر اور استاد تھے۔",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      }
    ];

    // Initialize categories
    const categoriesData: Category[] = [
      {
        id: "ghazal",
        name: "Ghazal",
        urduName: "غزل",
        description: "A form of amatory poem or ode",
        icon: "fas fa-feather-alt"
      },
      {
        id: "nazm",
        name: "Nazm",
        urduName: "نظم",
        description: "A form of Urdu poetry",
        icon: "fas fa-scroll"
      },
      {
        id: "rubai",
        name: "Rubai",
        urduName: "رباعی",
        description: "A four-line verse",
        icon: "fas fa-gem"
      },
      {
        id: "qasida",
        name: "Qasida",
        urduName: "قصیدہ",
        description: "A form of poetry",
        icon: "fas fa-crown"
      }
    ];

    // Initialize shayaris
    const shayarisData: Shayari[] = [
      {
        id: "1",
        poetId: "iqbal",
        categoryId: "ghazal",
        text: "ستاروں سے آگے جہاں اور بھی ہیں\nابھی عشق کے امتحان اور بھی ہیں",
        transliteration: "Sitaron se aage jahan aur bhi hain\nAbhi ishq ke imtihan aur bhi hain",
        translation: "Beyond the stars there are other worlds\nThere are still other trials of love",
        isFeatured: true
      },
      {
        id: "2",
        poetId: "ghalib",
        categoryId: "ghazal",
        text: "دل سے تری نگاہ جگر تک اتر گئی\nدونوں کو ایک ہی آگ میں جل کر رہ گئی",
        transliteration: "Dil se teri nigah jigar tak utar gayi\nDonon ko ek hi aag mein jal kar rah gayi",
        translation: "Your glance descended from heart to liver\nBoth remained burning in the same fire",
        isFeatured: false
      },
      {
        id: "3",
        poetId: "faiz",
        categoryId: "nazm",
        text: "یہ داغ داغ اجالا، یہ شب گزیدہ سحر\nوہ انتظار تھا جس کا، یہ وہ سحر تو نہیں",
        transliteration: "Ye daagh daagh ujala, ye shab gazida sahar\nWo intizar tha jis ka, ye wo sahar to nahin",
        translation: "This stained light, this night-bitten dawn\nThis is not the dawn we were waiting for",
        isFeatured: false
      },
      {
        id: "4",
        poetId: "josh",
        categoryId: "ghazal",
        text: "تم کو اے سنگ دل کس کا واسطہ دوں\nدل کو یا جان کو تیرے حوالے کر دوں",
        transliteration: "Tum ko ae sang dil kis ka wasita dun\nDil ko ya jaan ko tere hawale kar dun",
        translation: "O stone-hearted one, by whose oath should I appeal to you\nShould I entrust my heart or my life to you",
        isFeatured: false
      },
      {
        id: "5",
        poetId: "saghar",
        categoryId: "ghazal",
        text: "میری تنہائیوں میں تم شریک ہو گئے\nاب یہ تنہائیاں بھی تیری یادوں کا گھر",
        transliteration: "Meri tanhaiyoon mein tum shareek ho gaye\nAb ye tanhaiyaan bhi teri yadon ka ghar",
        translation: "You became a part of my solitude\nNow this loneliness is also the home of your memories",
        isFeatured: false
      },
      {
        id: "6",
        poetId: "faraz",
        categoryId: "ghazal",
        text: "رنج و غم کو دل سے کیسے نکالوں\nتم کو محبت سے کیسے بھلا دوں",
        transliteration: "Ranj o gham ko dil se kaise nikaalun\nTum ko mohabbat se kaise bhula dun",
        translation: "How can I remove sorrow and grief from my heart\nHow can I forget you with love",
        isFeatured: false
      },
      {
        id: "7",
        poetId: "meer",
        categoryId: "ghazal",
        text: "دل کے خوش رکھنے کو غالب یہ خیال اچھا ہے\nہر ایک بات پہ کہنا یہ رسم میری ہے",
        transliteration: "Dil ke khush rakhne ko Ghalib ye khayaal achha hai\nHar ek baat pe kehna ye rasm meri hai",
        translation: "To keep the heart happy, Ghalib, this thought is good\nTo say this on every matter is my custom",
        isFeatured: false
      },
      {
        id: "8",
        poetId: "zauq",
        categoryId: "ghazal",
        text: "لے کے پہلا نام اللہ کا لکھوں گا نعت\nحمد سے پہلے نبی کی کہہ کے سچی بات",
        transliteration: "Le ke pehla naam Allah ka likhun ga naat\nHamd se pehle Nabi ki keh ke sachchi baat",
        translation: "Taking Allah's name first, I will write praise\nSpeaking truthfully about the Prophet before praise",
        isFeatured: false
      },
      {
        id: "9",
        poetId: "momin",
        categoryId: "ghazal",
        text: "تم میرے پاس ہوتے ہو گویا\nجب کوئی دوسرا نہیں ہوتا",
        transliteration: "Tum mere paas hote ho goya\nJab koi doosra nahin hota",
        translation: "You seem to be with me\nWhen no one else is around",
        isFeatured: false
      },
      {
        id: "10",
        poetId: "dagh",
        categoryId: "ghazal",
        text: "یہ نہ تھی ہماری قسمت کہ وصال یار ہوتا\nاگر اور جیتے رہتے یہی انتظار ہوتا",
        transliteration: "Ye na thi hamari qismat ke wisaal yaar hota\nAgar aur jeete rehte yehi intizar hota",
        translation: "It was not our destiny to unite with the beloved\nIf we lived longer, this same waiting would continue",
        isFeatured: false
      },
      {
        id: "11",
        poetId: "iqbal",
        categoryId: "nazm",
        text: "خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے\nخدا بندے سے خود پوچھے بتا تیری رضا کیا ہے",
        transliteration: "Khudi ko kar buland itna ke har taqdeer se pehle\nKhuda bande se khud poochhe bata teri raza kya hai",
        translation: "Elevate yourself so high that before every decree\nGod himself asks his servant, tell me what is your wish",
        isFeatured: false
      },
      {
        id: "12",
        poetId: "ghalib",
        categoryId: "rubai",
        text: "بازیچہ اطفال ہے دنیا میرے آگے\nہوتا ہے شب و روز تماشا میرے آگے",
        transliteration: "Bazicha atfaal hai duniya mere aage\nHota hai shab o roz tamasha mere aage",
        translation: "The world is a child's plaything before me\nDay and night a spectacle unfolds before me",
        isFeatured: false
      }
    ];

    // Populate maps
    poetsData.forEach(poet => this.poets.set(poet.id, poet));
    categoriesData.forEach(category => this.categories.set(category.id, category));
    shayarisData.forEach(shayari => this.shayaris.set(shayari.id, shayari));
  }

  async getPoets(): Promise<Poet[]> {
    return Array.from(this.poets.values());
  }

  async getPoet(id: string): Promise<Poet | undefined> {
    return this.poets.get(id);
  }

  async createPoet(poet: InsertPoet): Promise<Poet> {
    const newPoet: Poet = { ...poet, id: poet.id || randomUUID() };
    this.poets.set(newPoet.id, newPoet);
    return newPoet;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = { ...category, id: category.id || randomUUID() };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async getShayaris(): Promise<ShayariWithPoet[]> {
    const result: ShayariWithPoet[] = [];
    for (const shayari of this.shayaris.values()) {
      const poet = this.poets.get(shayari.poetId);
      const category = this.categories.get(shayari.categoryId);
      if (poet && category) {
        result.push({ ...shayari, poet, category });
      }
    }
    return result;
  }

  async getShayarisByPoet(poetId: string): Promise<ShayariWithPoet[]> {
    const allShayaris = await this.getShayaris();
    return allShayaris.filter(s => s.poetId === poetId);
  }

  async getShayarisByCategory(categoryId: string): Promise<ShayariWithPoet[]> {
    const allShayaris = await this.getShayaris();
    return allShayaris.filter(s => s.categoryId === categoryId);
  }

  async getFeaturedShayari(): Promise<ShayariWithPoet | undefined> {
    const allShayaris = await this.getShayaris();
    return allShayaris.find(s => s.isFeatured);
  }

  async searchShayaris(query: string): Promise<ShayariWithPoet[]> {
    const allShayaris = await this.getShayaris();
    const lowerQuery = query.toLowerCase();
    return allShayaris.filter(s => 
      s.text.toLowerCase().includes(lowerQuery) ||
      s.poet.name.toLowerCase().includes(lowerQuery) ||
      s.poet.urduName.includes(query) ||
      (s.transliteration && s.transliteration.toLowerCase().includes(lowerQuery))
    );
  }

  async getShayari(id: string): Promise<ShayariWithPoet | undefined> {
    const shayari = this.shayaris.get(id);
    if (!shayari) return undefined;
    
    const poet = this.poets.get(shayari.poetId);
    const category = this.categories.get(shayari.categoryId);
    if (poet && category) {
      return { ...shayari, poet, category };
    }
    return undefined;
  }

  async createShayari(shayari: InsertShayari): Promise<Shayari> {
    const newShayari: Shayari = { ...shayari, id: shayari.id || randomUUID() };
    this.shayaris.set(newShayari.id, newShayari);
    return newShayari;
  }

  async getFavorites(): Promise<ShayariWithPoet[]> {
    const result: ShayariWithPoet[] = [];
    for (const favorite of this.favorites.values()) {
      const shayariWithPoet = await this.getShayari(favorite.shayariId);
      if (shayariWithPoet) {
        result.push(shayariWithPoet);
      }
    }
    return result;
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = randomUUID();
    const newFavorite: Favorite = { 
      ...favorite, 
      id, 
      createdAt: new Date().toISOString() 
    };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavorite(shayariId: string): Promise<boolean> {
    for (const [id, favorite] of this.favorites) {
      if (favorite.shayariId === shayariId) {
        this.favorites.delete(id);
        return true;
      }
    }
    return false;
  }

  async isFavorite(shayariId: string): Promise<boolean> {
    for (const favorite of this.favorites.values()) {
      if (favorite.shayariId === shayariId) {
        return true;
      }
    }
    return false;
  }
}

export const storage = new MemStorage();
