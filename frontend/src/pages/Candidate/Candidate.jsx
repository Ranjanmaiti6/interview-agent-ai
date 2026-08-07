const candidates = [
  {
    id: 1,
    name: "Riya Sharma",
    skills: "RAG, Prompt Engineering"
  },
  {
    id: 2,
    name: "Arjun Patel",
    skills: "AI Agents, Deployment"
  }
];


export default function Candidate(){

return (

<div className="p-10 bg-slate-950 min-h-screen">

<h1 className="text-white text-4xl font-bold mb-8">
Choose Candidate
</h1>


{
candidates.map((candidate)=>(

<div
key={candidate.id}
className="bg-slate-900 p-6 rounded-xl mb-5"
>

<h2 className="text-white text-2xl">
{candidate.name}
</h2>


<p className="text-slate-400 mt-2">
{candidate.skills}
</p>


<button

onClick={()=>{
window.location.href =
`/interview?id=${candidate.id}`;
}}

className="
mt-5
bg-blue-600
text-white
px-5
py-3
rounded-xl
"

>

Start Interview

</button>


</div>

))

}


</div>

);

}