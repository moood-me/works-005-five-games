const fs=require('fs');const d=fs.readFileSync(process.argv[2]);let p=0;
const u32=()=>{const v=d.readUInt32BE(p);p+=4;return v},u16=()=>{const v=d.readUInt16BE(p);p+=2;return v};
const vlq=()=>{let v=0,b;do{b=d[p++];v=(v<<7)|(b&127)}while(b&128);return v};
p=8;const fmt=u16(),nt=u16(),div=u16();console.log('fmt',fmt,'tracks',nt,'div',div);
const names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
for(let t=0;t<nt;t++){p+=4;const len=u32(),end=p+len;let time=0,run=0;const on={};const notes=[];
while(p<end){time+=vlq();let s=d[p];if(s<128)s=run;else p++;
if(s===0xff){const ty=d[p++];const l=vlq();if(ty===0x58||ty===0x51)console.log('meta',ty.toString(16),[...d.slice(p,p+l)]);p+=l;continue}
if(s===0xf0||s===0xf7){p+=vlq();continue}run=s;const hi=s>>4;
if(hi===9||hi===8){const n=d[p++],v=d[p++];if(hi===9&&v>0)on[n]=time;else if(on[n]!=null){notes.push([on[n],time-on[n],n]);delete on[n]}}
else if(hi===0xc||hi===0xd)p++;else p+=2;}
notes.sort((a,b)=>a[0]-b[0]);
console.log('track',t,notes.length);
let bar=-1,line='';for(const [s,l,n] of notes){const b=Math.floor(s/(div*3));if(b!==bar){if(line)console.log(line);bar=b;line=`${b}|`}line+=` ${names[n%12]}${Math.floor(n/12)-1}:${l/div}`}console.log(line)}
