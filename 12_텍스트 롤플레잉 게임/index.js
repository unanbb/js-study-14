const $startScreen = document.querySelector("#start-screen");
const $gameMenu = document.querySelector("#game-menu");
const $battleMenu = document.querySelector("#battle-menu");
const $heroName = document.querySelector("#hero-name");

const $heroLevel = document.querySelector("#hero-level");
const $heroHp = document.querySelector("#hero-hp");
const $heroXp = document.querySelector("#hero-xp");
const $heroAtt = document.querySelector("#hero-att");
const $monsterName = document.querySelector("#monster-name");
const $monsterHp = document.querySelector("#monster-hp");
const $monsterAtt = document.querySelector("#monster-att");
const $message = document.querySelector("#message");

class Game {
  constructor(name) {
    this.monster = null;
    this.hero = null;
    this.monsterList = [
      { name: "슬라임", hp: 25, att: 10, xp: 10 },
      { name: "스켈레톤", hp: 50, att: 15, xp: 20 },
      { name: "마왕", hp: 150, att: 35, xp: 50 },
    ];
    this.start(name); // start함수 호출
  };
  start(name) { // 게임 시작 메서드
    $gameMenu.addEventListener('submit',this.onGameMenuInput);
    $battleMenu.addEventListener('submit', this.onBattleMenuInput);
    this.changeScreen('game');
    this.hero = new Hero(name, this);
    this.showMessage(`원하는 행동을 선택해주세요.`);
    this.updateHeroStat();
  }
  changeScreen(screen){ // 화면전환 메서드
    if(screen === 'start'){
      $startScreen.style.display = 'block'; // 시작 메뉴 보이기
      $gameMenu.style.display = 'none';
      $battleMenu.style.display = 'none';
    } else if (screen === 'game'){
      $startScreen.style.display = 'none';
      $gameMenu.style.display = 'block'; // 일반 메뉴 보이기
      $battleMenu.style.display = 'none';
    } else if (screen === 'battle'){
      $startScreen.style.display = 'none';
      $gameMenu.style.display = 'none';
      $battleMenu.style.display = 'block'; // 전투 메뉴 보이기
    }
  }
  onGameMenuInput = (e) => {
    e.preventDefault();
    const input = e.target['menu-input'].value;
    if(input === '1'){
      this.changeScreen('battle');
      this.createMonster();
    } else if (input === '2'){

    } else if (input === '3'){
      
    }
  }
  onBattleMenuInput = (e) => {
    e.preventDefault();
    const input = e.target['battle-input'].value;
    if(input === '1'){
      const {hero,monster} = this;
      hero.attack(monster);
      monster.attack(hero);
      
      if(hero.hp <= 0){
        this.showMessage(`${hero.lev}레벨에서 전사. 주인공을 새로 생성하세요.`);
        this.quit();
      } else if (monster.hp <= 0){
        this.showMessage(`${monster.name} 처치. ${monster.xp}의 경험치를 얻었다.`);
        hero.getXp(monster.xp);
        this.monster = null;
        this.updateHeroStat();
        this.updateMonsterStat();
        this.changeScreen('game');
      } else { //피해 주고받기
        this.showMessage(`${hero.att}의 피해를 주고, ${monster.att}의 피해를 받았다.`);
        this.updateHeroStat();
        this.updateMonsterStat();
      }
    } else if (input === '2'){

    } else if (input === '3'){
      
    }
  }
  updateHeroStat() {
    const { hero } = this;
    if(hero === null){
      $heroName.textContent = '';
      $heroLevel.textContent = '';
      $heroHp.textContent = '';
      $heroXp.textContent = '';
      $heroAtt.textContent = '';
      return;
    }
    $heroName.textContent = hero.name;
    $heroLevel.textContent = `Lv.${hero.lev}`;
    $heroHp.textContent = `HP: ${hero.hp}/${hero.maxHp}`;
    $heroXp.textContent = `XP: ${hero.xp}/${15*hero.lev}`;
    $heroAtt.textContent = `ATT: ${hero.att}`;
  }
  createMonster() {
    const randomIndex = Math.floor(Math.random() * this.monsterList.length);
    const randomMonster = this.monsterList[randomIndex];
    this.monster = new Monster(
      randomMonster.name,
      randomMonster.hp,
      randomMonster.att,
      randomMonster.xp,
    );
    this.updateMonsterStat();
    this.showMessage(`몬스터와 마주쳤다. ${this.monster.name}인 것 같다!`);
  }
  updateMonsterStat(){
    const { monster } = this;
    if(monster === null){
      $monsterName.textContent = '';
      $monsterHp.textContent = '';
      $monsterAtt.textContent = '';
      return;
    }
    $monsterName.textContent = monster.name;
    $monsterHp.textContent = `HP: ${monster.hp}/${monster.maxHp}`;
    $monsterAtt.textContent = `ATT: ${monster.att}`;
  }
  showMessage(text){
    $message.textContent = text;
  }
  quit() { // 게임오버 메소드
    this.hero = null;
    this.monster = null;
    this.updateHeroStat();
    this.updateMonsterStat();
    $gameMenu.removeEventListener('submit', this.onGameMenuInput);
    $battleMenu.removeEventListener('submit', this.onBattleMenuInput);
    this.changeScreen('start');
    game = null;
  }
};
class Unit { // hero,monster 공통 클래스
  constructor(name,hp,att,xp){
    this.name = name;
    this.maxHp = hp;
    this.hp = hp;
    this.xp = xp;
    this.att = att;
  }
  attack(target){
    target.hp -= this.att;
  }
}
class Hero extends Unit {
  constructor(name, game) {
    super(name,100,10,0);
    this.lev = 1;
    this.game = game;
  }
  heal(monster) {
    this.hp += 20;
    this.hp -= monster.att;
  }
  getXp(xp) { // 레벨업 메서드
    this.xp += xp;
    if(this.xp >= this.lev * 15){
      this.xp -= this.lev*15;
      this.lev +=1;
      this.maxHp += 5;
      this.att += 5;
      this.hp = this.maxHp;
      this.game.showMessage(`레벨 업! ${this.lev}레벨이 되었습니다.`);
    }
  }
}
class Monster extends Unit {

}
let game = null;

$startScreen.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target["name-input"].value;
  game = new Game(game); // 게임 객체 생성
});