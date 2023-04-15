import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section>
        <h1>hello</h1>
        <div className="container">
          <h2>预处理器</h2>
          <ul>
            <li className="active"><p>scss</p></li>
            <li><p>less</p></li>
          </ul>
          
        </div>
      </section>
    </main>
  );
}
