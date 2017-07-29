class Forum {
  campagne_id: number;

  constructor(campagne_id) {
    this.campagne_id = campagne_id;
  }
}

class Section {
  id: number;
  label: string;
  orderIndex: number;
  isFold: boolean;
  topics: Array<Topic>;

  constructor(data) {
    this.id = data.id;
    this.label = data.label;
    this.orderIndex = data.orderIndex;
    this.isFold = data.isFold;
    this.topics = [];
  }

  addTopic(topic) {
    this.topics.push(topic);
  }
}

class Topic {
  id: number;
  label: string;
  orderIndex: number;
  posts: Array<Post>;

  constructor(data) {
    this.id = data.id;
    this.label = data.label;
    this.orderIndex = data.orderIndex;
    this.posts = [];
  }

  addPosts(post) {
      this.posts.push(post);
  }
}

class Post {
  id: number;
  htmlContent: string;
  orderIndex: number;
  character: any;
  user: any;
  place: any;

  constructor(data) {
    this.id = data.id;
    this.htmlContent = data.content;
    this.orderIndex = data.orderIndex;
  }
  setCharacter(character) {
    this.character = character;
  }
  setUser(user) {
    this.user = user;
  }
  setPlace(place) {
    this.place = place;
  }
}
