export default function LetterBox(
  { value }: {value : string},
) {
  return (
    <div className="flex justify-center items-center bg-slate-50 text-2xl font-bold uppercase size-12 border-black border-2">
      {value}
    </div>
  );
}
