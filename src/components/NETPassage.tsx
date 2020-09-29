import React from "react";
import { useFetch } from "../functions/useFetch";

export function NETPassage(props: { reference: string | null }) {
  const { reference } = props;
  const url = reference ? urlOf(reference) : "";
  const [response] = useFetch<Verse[]>(url);
  return (
    <>
      {response?.map((passage, index, verses) => (
        <p key={passage.verse + passage.chapter + index} className="hint">
          {passage.text
            .slice(0, passage.text.indexOf("<a style="))
            .replace(/<\/?[\w]+?\/?>/g, "")}
          {index === verses.length - 1 && (
            <a href="https://labs.bible.org/api_web_service#">
              <b>&copy;NET</b>
            </a>
          )}
        </p>
      ))}
      {response && <br />}
    </>
  );
}
const urlOf = (ref: string) =>
  "https://labs.bible.org/api/?passage=" + encodeURI(ref) + "&type=json";
interface Verse {
  text: string;
  book: string;
  verse: string;
  chapter: string;
}
