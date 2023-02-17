import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import Manager from './components/Manager';

import * as constants from './utils/constants';
import TypingWriter from './components/TypingWriter';

function App() {
  const [chatIsActive, setChatIsActive] = useState<boolean>(false);
  const [params, setParams] = useState({
    typingSpeed: 50,
    deletingSpeed: 30,
    startLeft: false,
  });
  const [items, setItems] = useState<constants.ITEM_TABLE>();

  const typingWriterDivRef = useRef<HTMLDivElement>(null);
  const typingWriterRef = useRef<TypingWriter>();

  useEffect(() => {
    if (typingWriterDivRef.current)
      typingWriterRef.current = new TypingWriter(document.querySelector('.chat-frame') as HTMLElement, setChatIsActive);
  }, [typingWriterDivRef]);

  function sendItems(inputList: constants.ITEM_TABLE): void {
    setItems(inputList);
  }

  function launchScript() {
    if (!items || !typingWriterRef.current) return;

    let typingWriter = typingWriterRef.current;

    if (typingWriter.isActive()) return;
    else if (typingWriter.isFinished()) {
      typingWriter.reset();
      typingWriter = typingWriterRef.current;
    }

    typingWriter.typingSpeed = params.typingSpeed;
    typingWriter.deletingSpeed = params.deletingSpeed;

    items.forEach((item) => {
      if (item.type == constants.DATA_TYPE.TEXT) typingWriter.type(item.value as string);
      else if (item.type == constants.DATA_TYPE.PAUSE) typingWriter.pauseFor(item.value as number);
      else if (item.type == constants.DATA_TYPE.DELETE) typingWriter.deleteChar(item.value as number);
      else if (item.type == constants.DATA_TYPE.REMOVE) typingWriter.deleteAll(item.value as number);
      else if (item.type == constants.DATA_TYPE.ADD) typingWriter.newBubble(item.value === 'true');
    });

    typingWriter.start(params.startLeft);
  }

  function resetScript() {
    if (!typingWriterRef.current) return;

    typingWriterRef.current.reset();
    typingWriterRef.current = new TypingWriter(document.querySelector('.chat-frame') as HTMLElement, setChatIsActive);
  }
  // END of V.1.0 Refacto

  return (
    <div className='App'>
      <section className='grid'>
        <article className='grid__section-1'>
          <div ref={typingWriterDivRef} className='chat-frame'></div>
        </article>
        <article className='grid__section-2'>
          <div className='main-params'>
            {/* General chat settings */}
            <div className='main-params__inputs'>
              <span>Paramètres généraux :</span>
              <div>
                <label>Commencer par une bulle à gauche :</label>
                <input
                  type='checkbox'
                  name='startLeftCheckbox'
                  id=''
                  onChange={(event) =>
                    setParams((prevParams) => ({
                      typingSpeed: prevParams.typingSpeed,
                      deletingSpeed: prevParams.deletingSpeed,
                      startLeft: event.currentTarget.checked,
                    }))
                  }
                />
              </div>
              <div>
                <label>Vitesse d'écriture (en ms) :</label>
                <input
                  type='number'
                  defaultValue={50}
                  name='typingSpeed'
                  onChange={(event) =>
                    setParams((prevParams) => ({
                      typingSpeed: parseInt(event.target.value),
                      deletingSpeed: prevParams.deletingSpeed,
                      startLeft: prevParams.startLeft,
                    }))
                  }
                />
              </div>
              <div>
                <label>Vitesse de suppression (en ms) :</label>
                <input
                  type='number'
                  defaultValue={30}
                  name='deletingSpeed'
                  onChange={(event) =>
                    setParams((prevParams) => ({
                      typingSpeed: prevParams.typingSpeed,
                      deletingSpeed: parseInt(event.target.value),
                      startLeft: prevParams.startLeft,
                    }))
                  }
                />
              </div>
            </div>

            <div className='main-button'>
              <button onClick={launchScript} className={items != undefined && items.length > 0 ? '' : 'blocked'}>
                {chatIsActive ? 'Scénario en cours' : 'Lancer le scénario'}
              </button>
              <button onClick={resetScript}>Reinitialiser le scénario</button>
            </div>
          </div>

          <div className='footer'>
            <span>
              &copy; {new Date().getFullYear()} <a href='https://github.com/kinderrkill'>E-Code</a>. Tous droits
              réservés - Made with ♥
            </span>
          </div>
        </article>
        <article className='grid__section-3'>
          <Manager sendItems={sendItems} />
        </article>
      </section>
    </div>
  );
}

export default App;
