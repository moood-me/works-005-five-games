const fs=require('fs');const d=fs.readFileSync(process.argv[2]);let p=0;
const u32=()=>{const v=d.readUInt32BE(p);p+=4;return v},u16=()=>{const v=d.readUInt16BE(p);p+=2;return v};
const vlq=()=>{let v=0,b;do{b=d[p++];v=(v<<7)|(b&127)}while(b&128);return v};
p=8;u16();const nt=u16(),div=u16();const notes=[];
for(let t=0;t<nt;t++){p+=4;const len=u32(),end=p+len;let time=0,run=0;const on={};
while(p<end){time+=vlq();let s=d[p];if(s<128)s=run;else p++;
if(s===0xff){p++;const l=vlq();p+=l;continue}if(s===0xf0||s===0xf7){p+=vlq();continue}run=s;const hi=s>>4;
if(hi===9||hi===8){const n=d[p++],v=d[p++];if(hi===9&&v>0)on[n]=time;else if(on[n]!=null){notes.push([on[n],time-on[n],n]);delete on[n]}}
else if(hi===0xc||hi===0xd)p++;else p+=2;}}
notes.sort((a,b)=>a[0]-b[0]);
const bar1=div*3, endb=48*div*3;const out=[];
for(const [s,l,n] of notes){if(s<bar1||s>=endb)continue;const st=Math.round((s-bar1)/div*8)/8,ln=Math.max(0.125,Math.round(l/div*8)/8);out.push(`[${st},${ln},${n-4}]`)}
console.log(out.length);console.log(out.join(','));
