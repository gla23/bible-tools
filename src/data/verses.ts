import otVerseCountsPure from "./otVerseCounts.json";
import ntVerseCountsPure from "./ntVerseCounts.json";

type TotalledArray<T> = T[] & {
  total: number;
  cumulative: number;
};

type Book = number[];
type Testament = Book[];

function bookWithTotal(array: Book, cumulative: number): TotalledArray<number> {
  const total = array.reduce((acc, val) => acc + val);
  return Object.assign(array, { total, cumulative: cumulative + total });
}

const totalUp = (
  testament: Testament,
  cumulative = 0
): TotalledArray<TotalledArray<number>> => {
  const totalled = testament.map((book) => {
    const withTotal = bookWithTotal(book, cumulative);
    cumulative += withTotal.total;
    return withTotal;
  });
  const total = totalled.reduce((acc, book) => acc + book.total, 0);
  return Object.assign(totalled, { total, cumulative });
};

export const otVerseCounts: TotalledArray<TotalledArray<number>> = totalUp(
  otVerseCountsPure as number[][]
);
export const ntVerseCounts: TotalledArray<TotalledArray<number>> = totalUp(
  ntVerseCountsPure as number[][],
  otVerseCounts.total
);

export const verseCounts = {
  o: otVerseCounts,
  n: ntVerseCounts,
  total: otVerseCounts.total + ntVerseCounts.total,
  cumulative: ntVerseCounts.cumulative,
};
