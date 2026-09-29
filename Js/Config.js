*{margin:0;padding:0;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent;}
:root{--pink:#ff6b9d;--pink2:#ff3d7f;--gold:#ffd166;--purple:#6a4c93;--green:#2ecc71;--red:#e74c3c;}
body{font-family:'Segoe UI',Tahoma,sans-serif;
  background:radial-gradient(circle at 50% 15%,#3a1c52,#1a0b2e 60%,#0a0418 100%);
  min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px;transition:background 1s;}
#hearts{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
.heart{position:absolute;top:-40px;font-size:18px;opacity:0;animation:fall linear infinite;}
@keyframes fall{0%{transform:translateY(0) rotate(0)}10%{opacity:.7}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}

#table{position:relative;z-index:1;text-align:center;padding:18px 16px 14px;border-radius:26px;
  background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(0,0,0,.35));
  border:1px solid rgba(255,107,157,.25);
  box-shadow:0 0 80px rgba(180,80,255,.35),inset 0 0 40px rgba(0,0,0,.5);
  backdrop-filter:blur(6px);max-width:600px;width:100%;transition:transform .3s;}
.cornerBtn{position:absolute;top:10px;width:30px;height:30px;border-radius:50%;
  border:1px solid rgba(255,107,157,.4);background:rgba(0,0,0,.35);color:var(--gold);
  font-size:13px;cursor:pointer;transition:transform .15s;display:flex;align-items:center;justify-content:center;}
.cornerBtn:hover{transform:scale(1.12);}
#soundToggle{right:10px;} #achBtn{right:46px;} #shopBtn{left:10px;} #diaryBtn{left:46px;}
#lbBtn{right:82px;} #saveBtn{left:82px;}

h1{color:var(--gold);font-size:21px;text-shadow:0 0 25px rgba(255,209,102,.8);letter-spacing:2px;}
.sub{color:#c9a0e8;font-size:10px;margin:3px 0 5px;}
#playerTag{font-size:11px;color:#ffb3cd;margin-bottom:5px;}
#playerTag b{color:var(--gold);cursor:pointer;border-bottom:1px dashed var(--gold);}

#themeRow{display:flex;gap:5px;justify-content:center;margin-bottom:6px;flex-wrap:wrap;}
.themeBtn{padding:4px 9px;border-radius:20px;font-size:10px;cursor:pointer;
  background:rgba(0,0,0,.3);border:1px solid rgba(255,107,157,.3);color:#c9a0e8;transition:all .2s;}
.themeBtn:hover{transform:scale(1.05);}
.themeBtn.active{background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff;
  border-color:transparent;box-shadow:0 0 15px rgba(255,107,157,.7);}

#levelRow{display:flex;align-items:center;gap:8px;justify-content:center;font-size:11px;color:#c9a0e8;margin-bottom:5px;}
#levelRow b{color:var(--gold);font-size:13px;}
#xpBar{width:100px;height:8px;border-radius:5px;background:rgba(0,0,0,.4);overflow:hidden;border:1px solid rgba(255,107,157,.3);}
#xpFill{height:100%;width:0%;background:linear-gradient(90deg,var(--pink),var(--gold));transition:width .4s;box-shadow:0 0 10px var(--pink);}

#balance{color:#fff;font-size:16px;margin-bottom:3px;}
#balance b{color:var(--green);font-size:23px;transition:color .3s,transform .3s;display:inline-block;}
#balance b.bump{transform:scale(1.35);color:var(--gold);}
#balance b.down{color:var(--red);}
#streak{font-size:11px;color:#c9a0e8;min-height:16px;margin-bottom:3px;}
#comboTag{display:inline-block;padding:3px 9px;border-radius:10px;font-size:11px;font-weight:bold;
  background:linear-gradient(135deg,#f39c12,#e67e22);color:#fff;margin-left:5px;
  box-shadow:0 0 12px rgba(243,156,18,.8);animation:pulse 1s infinite;}
@keyframes pulse{50%{transform:scale(1.08);}}

#eventBanner{margin:4px auto;padding:5px 12px;border-radius:20px;font-size:11px;
  background:linear-gradient(135deg,#9d4edd,#ff6b9d);color:#fff;display:none;
  box-shadow:0 0 20px rgba(157,78,221,.7);animation:pulse 1.5s ease-in-out infinite;}
#eventBanner.on{display:inline-block;}
#freeBadge{margin:4px auto;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:bold;
  background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff;display:inline-block;
  box-shadow:0 0 20px rgba(255,107,157,.7);animation:pulse 1.2s ease-in-out infinite;}
#freeBadge.hidden{display:none;}
#dailyBadge{margin:4px auto;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:bold;
  background:linear-gradient(135deg,#f39c12,#e74c3c);color:#fff;display:inline-block;
  box-shadow:0 0 20px rgba(243,156,18,.7);cursor:pointer;animation:pulse 1.2s infinite;}
#dailyBadge.hidden{display:none;}

#reels{display:flex;gap:10px;justify-content:center;margin:10px 0;perspective:800px;}
.reel{width:92px;height:92px;background:linear-gradient(180deg,#fff,#ffe9f3);border-radius:16px;
  border:3px solid var(--pink);box-shadow:0 6px 20px rgba(255,107,157,.5),inset 0 -8px 16px rgba(255,107,157,.25);
  display:flex;align-items:center;justify-content:center;font-size:48px;position:relative;overflow:hidden;transition:transform .15s;}
.reel.spinning{animation:reelShake .15s infinite;}
@keyframes reelShake{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.reel .inner{position:absolute;width:100%;text-align:center;transition:filter .1s;}
.reel.blur .inner{filter:blur(3px);}
.reel.win{border-color:var(--gold);box-shadow:0 0 28px var(--gold),inset 0 -8px 16px rgba(255,209,102,.3);}
.reel.wild{border-color:#9d4edd;box-shadow:0 0 24px #9d4edd,inset 0 -8px 16px rgba(157,78,221,.3);}
.reel.scatter{border-color:#ff8fab;box-shadow:0 0 24px #ff8fab,inset 0 -8px 16px rgba(255,143,171,.3);}
.reel.lucky{border-color:#2ecc71;box-shadow:0 0 24px #2ecc71,inset 0 -8px 16px rgba(46,204,113,.3);}

#winLine{height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:5px 0 8px;opacity:0;transition:opacity .3s;}
#winLine.on{opacity:1;box-shadow:0 0 14px var(--gold);}

#controls{display:flex;gap:7px;justify-content:center;align-items:center;flex-wrap:wrap;}
.btn{border:none;border-radius:12px;padding:10px 16px;font-size:14px;font-weight:bold;cursor:pointer;
  color:#fff;transition:transform .12s,box-shadow .12s,filter .12s;}
.btn:hover:not(:disabled){transform:scale(1.06);filter:brightness(1.1);}
.btn:active:not(:disabled){transform:scale(.95);}
.btn:disabled{opacity:.45;cursor:not-allowed;}
#spinBtn{background:linear-gradient(135deg,var(--pink),var(--pink2));box-shadow:0 4px 18px rgba(255,61,127,.55);
  font-size:17px;padding:12px 28px;letter-spacing:1px;}
#spinBtn:not(:disabled):hover{box-shadow:0 4px 30px rgba(255,61,127,.9);}
.betBtn{background:var(--purple);padding:9px 14px;font-size:17px;}
.betBtn:hover:not(:disabled){box-shadow:0 0 16px rgba(106,76,147,.9);}
#bet{color:var(--gold);font-size:17px;font-weight:bold;min-width:65px;display:inline-block;}
.betLabel{color:#c9a0e8;font-size:12px;}
#autoBtn{background:linear-gradient(135deg,#9d4edd,#6a4c93);padding:10px 14px;font-size:13px;}
#autoBtn.on{background:linear-gradient(135deg,var(--green),#27ae60);box-shadow:0 0 20px rgba(46,204,113,.8);}

#betPresets{display:flex;gap:4px;justify-content:center;margin-top:6px;flex-wrap:wrap;}
.presetBtn{padding:4px 9px;border-radius:8px;font-size:10px;font-weight:bold;cursor:pointer;
  background:rgba(106,76,147,.5);border:1px solid rgba(255,107,157,.3);color:#ffb3cd;transition:all .15s;}
.presetBtn:hover{background:var(--purple);color:#fff;transform:scale(1.06);}
.presetBtn.allin{background:linear-gradient(135deg,#e74c3c,#c0392b);color:#fff;}

#quests{margin-top:8px;padding:7px 9px;border-radius:12px;background:rgba(157,78,221,.08);
  border:1px solid rgba(157,78,221,.3);text-align:left;}
#quests .qHead{font-size:11px;color:#c9a0e8;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;}
#quests .qHead b{color:var(--gold);font-size:12px;}
.qItem{font-size:10px;color:#c9a0e8;padding:4px 6px;border-radius:6px;background:rgba(0,0,0,.25);margin-bottom:3px;
  display:flex;justify-content:space-between;gap:5px;align-items:center;}
.qItem.done{color:#2ecc71;background:rgba(46,204,113,.1);}
.qItem .qReward{color:var(--gold);font-weight:bold;white-space:nowrap;font-size:10px;}
.qItem .qBarWrap{flex:1;height:4px;background:rgba(0,0,0,.4);border-radius:3px;overflow:hidden;margin:0 4px;}
.qItem .qBar{height:100%;background:linear-gradient(90deg,var(--pink),var(--gold));transition:width .4s;}

#gamblePanel{margin-top:8px;padding:9px;border-radius:14px;background:rgba(255,107,157,.08);
  border:1px solid rgba(255,107,157,.35);display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;}
#gamblePanel.hidden{display:none;}
#gamblePanel > div{color:#ffb3cd;font-size:13px;width:100%;}
#gamblePanel b{color:var(--gold);font-size:19px;}
.gambleBtn{background:linear-gradient(135deg,#f39c12,#e67e22);box-shadow:0 4px 18px rgba(243,156,18,.5);}
.collectBtn{background:linear-gradient(135deg,var(--green),#27ae60);box-shadow:0 4px 18px rgba(46,204,113,.5);}

#msg{margin-top:10px;min-height:56px;color:#ffb3cd;font-size:14px;font-style:italic;
  text-shadow:0 1px 4px #000;line-height:1.5;}
#msg .big{color:var(--gold);font-size:19px;font-weight:bold;font-style:normal;display:block;margin-bottom:4px;}
#msg .lose{color:var(--red);font-weight:bold;font-style:normal;}

#history{display:flex;gap:4px;justify-content:center;margin-top:6px;flex-wrap:wrap;}
#history .hchip{padding:3px 6px;border-radius:8px;background:rgba(0,0,0,.4);font-size:13px;
  border:1px solid rgba(255,107,157,.2);opacity:.65;}
#history .hchip.win{border-color:var(--gold);opacity:1;background:rgba(255,209,102,.15);}
#history .hchip.lose{border-color:#555;opacity:.4;}

#stats{display:flex;justify-content:space-around;margin-top:7px;padding-top:7px;
  border-top:1px solid rgba(255,107,157,.2);font-size:9px;color:#9b7fc4;gap:3px;}
#stats div{text-align:center;flex:1;}
#stats b{display:block;color:#ffb3cd;font-size:13px;margin-bottom:2px;}

.marquee{overflow:hidden;white-space:nowrap;color:#8e6bc0;font-size:9px;margin-top:7px;}
.marquee span{display:inline-block;padding-left:100%;animation:scroll 22s linear infinite;}
@keyframes scroll{to{transform:translateX(-100%);}}

.glow-win{animation:gw 1s ease 2;}
@keyframes gw{50%{box-shadow:0 0 100px rgba(255,209,102,.9),inset 0 0 50px rgba(255,209,102,.25);}}
.shake{animation:sh .4s;}
@keyframes sh{20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}

#floatWin{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);
  font-size:48px;font-weight:bold;color:var(--gold);text-shadow:0 0 30px var(--gold);
  pointer-events:none;z-index:100;opacity:0;}
#floatWin.show{animation:pop 1.4s ease forwards;}
@keyframes pop{0%{transform:translate(-50%,-50%) scale(0);opacity:0}25%{transform:translate(-50%,-50%) scale(1.2);opacity:1}75%{transform:translate(-50%,-70%) scale(1);opacity:1}100%{transform:translate(-50%,-90%) scale(.8);opacity:0}}

#coinFlip{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);font-size:96px;
  pointer-events:none;z-index:200;opacity:0;text-shadow:0 0 40px #fff;}
#coinFlip.show{animation:coinAnim 1.6s ease forwards;}
@keyframes coinAnim{0%{transform:translate(-50%,-50%) scale(0) rotateY(0)}15%{transform:translate(-50%,-50%) scale(1.3) rotateY(0);opacity:1}100%{transform:translate(-50%,-50%) scale(1.6) rotateY(720deg);opacity:0}}

#toastBox{position:fixed;top:14px;right:14px;z-index:300;display:flex;flex-direction:column;gap:7px;max-width:250px;}
.toast{padding:9px 12px;border-radius:12px;background:linear-gradient(135deg,#9d4edd,#ff6b9d);
  color:#fff;font-size:12px;font-weight:bold;box-shadow:0 4px 20px rgba(157,78,221,.7);
  animation:toastIn .4s ease, toastOut .4s ease 3.5s forwards;}
.toast.gold{background:linear-gradient(135deg,#f39c12,#ffd166);color:#3a1c52;box-shadow:0 4px 20px rgba(255,209,102,.9);}
.toast .tt{font-size:10px;opacity:.85;font-weight:normal;margin-bottom:3px;}
@keyframes toastIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes toastOut{to{transform:translateX(120%);opacity:0}}

.modal{position:fixed;inset:0;background:rgba(10,4,24,.9);z-index:250;
  display:flex;align-items:center;justify-content:center;padding:12px;opacity:0;pointer-events:none;transition:opacity .3s;}
.modal.on{opacity:1;pointer-events:auto;}
.modalInner{background:linear-gradient(180deg,#2a1148,#150828);padding:16px;border-radius:20px;
  border:1px solid rgba(255,107,157,.4);max-width:480px;width:100%;max-height:82vh;overflow-y:auto;
  box-shadow:0 0 60px rgba(255,107,157,.4);}
.modalInner h2{color:var(--gold);font-size:17px;margin-bottom:10px;text-align:center;}
.modalInner .hint{font-size:10px;color:#9b7fc4;text-align:center;margin-bottom:10px;}
.closeBtn{margin-top:10px;width:100%;padding:9px;border-radius:10px;border:none;
  background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff;font-weight:bold;cursor:pointer;font-size:13px;}
.closeBtn:hover{filter:brightness(1.15);}

.achItem,.shopItem{padding:7px 9px;margin-bottom:5px;border-radius:10px;background:rgba(0,0,0,.35);
  border:1px solid rgba(255,107,157,.15);font-size:11px;color:#c9a0e8;
  display:flex;justify-content:space-between;align-items:center;gap:6px;}
.achItem.done,.shopItem.owned{background:rgba(255,209,102,.12);border-color:rgba(255,209,102,.5);color:#ffd166;}
.shopItem.owned{background:rgba(46,204,113,.12);border-color:rgba(46,204,113,.5);}
.achItem .achName,.shopItem .shopName{font-weight:bold;font-size:12px;}
.achItem .achDesc,.shopItem .shopDesc{font-size:9px;opacity:.75;color:#9b7fc4;margin-top:2px;}
.achItem .achReward,.shopItem .shopPrice{color:var(--green);font-weight:bold;font-size:11px;white-space:nowrap;}
.shopItem .shopIcon{font-size:20px;width:26px;text-align:center;}
.shopItem .shopPrice{background:linear-gradient(135deg,var(--pink),var(--purple));
  color:#fff;padding:5px 10px;border-radius:9px;cursor:pointer;border:none;transition:transform .15s;}
.shopItem .shopPrice:hover:not(:disabled){transform:scale(1.07);}
.shopItem .shopPrice:disabled{background:#444;cursor:not-allowed;opacity:.6;}

.diaryEntry{padding:8px 10px;margin-bottom:6px;border-radius:10px;background:rgba(0,0,0,.35);
  border-left:3px solid var(--pink);font-size:11px;color:#ffb3cd;font-style:italic;line-height:1.4;}
.diaryEntry .dDate{font-size:9px;color:#9b7fc4;font-style:normal;margin-bottom:3px;}

#wheelStage{width:210px;height:210px;margin:10px auto;position:relative;
  border-radius:50%;background:conic-gradient(
    #ff6b9d 0deg 45deg,#ffd166 45deg 90deg,#6a4c93 90deg 135deg,
    #2ecc71 135deg 180deg,#e74c3c 180deg 225deg,#9d4edd 225deg 270deg,
    #00d9ff 270deg 315deg,#f39c12 315deg 360deg);
  box-shadow:0 0 40px rgba(255,107,157,.6),inset 0 0 30px rgba(0,0,0,.4);
  border:5px solid #ffd166;transition:transform 4s cubic-bezier(.15,.9,.25,1);}
#wheelPointer{font-size:34px;position:absolute;top:-20px;left:50%;transform:translateX(-50%);
  filter:drop-shadow(0 0 8px #ffd166);z-index:2;}
#wheelWrap{position:relative;display:inline-block;margin:6px 0;text-align:center;}
#wheelPrize{margin-top:10px;font-size:17px;color:var(--gold);font-weight:bold;min-height:24px;text-align:center;}

.lbTable{width:100%;border-collapse:collapse;font-size:12px;}
.lbTable th{color:#c9a0e8;font-size:10px;font-weight:normal;padding:6px 4px;border-bottom:1px solid rgba(255,107,157,.2);text-align:left;}
.lbTable td{padding:7px 4px;border-bottom:1px solid rgba(255,107,157,.08);color:#ffb3cd;}
.lbTable tr.me{background:rgba(255,209,102,.1);}
.lbTable tr.me td{color:var(--gold);font-weight:bold;}
.lbRank{font-size:14px;width:32px;text-align:center;}
.lbRank.gold{color:#ffd166;text-shadow:0 0 8px #ffd166;}
.lbRank.silver{color:#c0c0c0;}
.lbRank.bronze{color:#cd7f32;}
.lbChips{color:var(--green);font-weight:bold;font-size:13px;text-align:right;}
.lbName{max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.lbLvl{font-size:10px;color:#9b7fc4;}
.lbEmpty{text-align:center;color:#9b7fc4;font-size:12px;padding:20px 10px;font-style:italic;}
.lbRow input{width:100%;padding:7px 9px;border-radius:9px;border:1px solid rgba(255,107,157,.4);
  background:rgba(0,0,0,.4);color:#fff;font-size:13px;outline:none;}
.lbRow input:focus{border-color:var(--gold);}
.lbActions{display:flex;gap:6px;margin-top:10px;}
.lbActions button{flex:1;padding:9px;border-radius:10px;border:none;cursor:pointer;font-size:12px;font-weight:bold;
  color:#fff;transition:transform .15s;}
.lbActions button:hover{transform:scale(1.03);}
#lbSave{background:linear-gradient(135deg,var(--green),#27ae60);}
#lbRefresh{background:linear-gradient(135deg,var(--pink),var(--purple));}
#lbClear{background:linear-gradient(135deg,#7f1d1d,#c0392b);}

@media (max-width:480px){
  h1{font-size:16px;}.reel{width:70px;height:70px;font-size:34px;}
  #spinBtn{padding:10px 20px;font-size:14px;}.btn{padding:8px 10px;font-size:12px;}
  #xpBar{width:60px;}
  #wheelStage{width:170px;height:170px;}
  .lbName{max-width:70px;}
}
