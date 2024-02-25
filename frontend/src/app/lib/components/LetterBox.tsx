export default function LetterBox(
  { value, color }: {value : string, color: string},
) {
  return (
    <div className={`${color} flex justify-center items-center text-2xl text-slate-50 font-bold uppercase size-12 border-black border-2`}>
      {value}
    </div>
  );
}
