function is_integer(arg){
    if(typeof arg !== 'number' || arg !== Math.floor(arg)) return false;
    return true;
}
function check_index(index, arr) {
    if(!is_integer(index)) {
        console.error("Type of index is not integer");
        return false;
    }
    if(!Array.isArray(arr)) {
        console.error(`"arr" is not Array`);
        return false;
    }
    if(index >= arr.length || index < 0){
        console.error("Index out of range");
        return false;
    }
    return true;
}
function check_index_range (index, min, max){
    if(!is_integer(index) || !is_integer(min) || !is_integer(max)) {
        console.error("Type of argument is invalid");
        return false;
    }
    if(index >= max || index < min){
        console.error("Index out of range");
        return false;
    }
    return true;
}

const CONFIG = {
    trumpFactor: 1000,
    min_strength: 6,
    DEBUG: true
};

Object.freeze(CONFIG);

class CardDeck_Initializer {
    
    #values = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    #suits = ["♠", "♥", "♦", "♣"];
    
    getCountCards(){
        return this.#values.length * this.#suits.length;
    }
    getUnicCard(index){
        if(!check_index_range(index, 0, this.getCountCards())) return;
        return new Card(
            this.#values[index % this.#values.length], 
            this.#suits[index % this.#suits.length], 
            CONFIG.min_strength + index % this.#values.length, 
            this);
    }
    checkValue(val) {
        return this.#values.findIndex(item => item === val) >= 0;
    }
    checkSuit(val){
        return this.#suits.findIndex(item => item===val) >= 0;
    }
}
class Card {

    #value = null;
    #suit = null;
    #strength = null;
    constructor(value, suit, strength, CDI)
    {
        if(
            !CDI.checkValue(value) || 
            !CDI.checkSuit(suit) || 
            typeof strength !== 'number' || 
            Math.floor(strength) !== strength || 
            strength < CONFIG.min_strength || 
            (strength >= CONFIG.min_strength + CDI.getCountOfValues && strength <= CONFIG.min_strength + CONFIG.trumpFactor) ||
            strength > CONFIG.min_strength + CONFIG.trumpFactor + CDI.getCountOfValues
        ) return;
        
            this.#value = value;
            this.#suit = suit;
            this.#strength = strength;
    }
    set_trump(chg)
    {
        if (chg) {
            this.#strength += (this.#strength > CONFIG.trumpFactor) ? 0 : CONFIG.trumpFactor;
        } else {
            this.#strength -= (this.#strength > CONFIG.trumpFactor) ? CONFIG.trumpFactor : 0;
        }
    }
    get value() {
        return this.#value;
    }
    get suit() {
        return this.#suit;
    }
    get strength() {
        return this.#strength;
    }

    set value(x){}
    set suit(x){}
    set strength(x){};

    debug(){
        console.log(`${this.#suit} ${this.#value} ${this.#strength}`);
    }
}
class CardDeck {
    #trump_suit="";
    #deck = [];
    #CI = new CardDeck_Initializer();

    constructor() {
        this.New();
    }
    set_trump() {
        this.#trump_suit = this.#deck[Math.floor(Math.random() * this.#CI.getCountCards())].suit;
        this.#deck.forEach(item => item.set_trump(item.suit == this.#trump_suit));
    }
    New() {
        for(var i = 0; i < this.#CI.getCountCards(); i++){
            this.#deck[i] = this.#CI.getUnicCard(i);
        }
        this.set_trump();
        this.shuffle();
    }
    shuffle(){
        for(let i = 0; i < this.#CI.getCountCards(); i++){
            let random_index = Math.floor(Math.random() * this.#CI.getCountCards());
            let tmp = this.#deck[i];
            this.#deck[i] = this.#deck[random_index];
            this.#deck[random_index] = tmp;
        }
    }
    get trump_suit() {
        return this.#trump_suit;
    }
    set trump_suit(x) {}
    get count() {
        return this.#deck.length;
    }
    set count(x){}
    get_card(x) {
        if(check_index(x, this.#deck))
            return this.#deck[x];
    }
}

let tst = new CardDeck();
for(let i = 0; i < tst.count; i++){
    tst.get_card(i).debug();
}