 const html = document.documentElement;
      const toggle = document.getElementById('darkToggle');
      const label = document.getElementById('toggle-text');
      const icon = document.getElementById('toggle-icon');

      // Persist preference
      const saved = localStorage.getItem('theme');
      if (saved) setTheme(saved);

      toggle.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(next);
        localStorage.setItem('theme', next);
      });

      function setTheme(t) {
        html.setAttribute('data-theme', t);
        label.textContent = t === 'dark' ? 'Dark' : 'Light';
        icon.textContent = t === 'dark' ? '🌙' : '☀️';
      }



      function updateSum() {
        const a = parseFloat(document.getElementById('numA').value) || 0;
        const b = parseFloat(document.getElementById('numB').value) || 0;
        document.getElementById('sumOut').value = a + b;
      }

      // Dialog
      const dlg = document.getElementById('myDialog');
      document.getElementById('openDialog').addEventListener('click', () => dlg.showModal());
      document.getElementById('closeDialog').addEventListener('click', () => dlg.close());
      document.getElementById('cancelDialog').addEventListener('click', () => dlg.close());
      document.getElementById('confirmDialog').addEventListener('click', () => { dlg.close(); });
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });



      // Canvas drawing
      const canvas = document.getElementById('myCanvas');
      const ctx = canvas.getContext('2d');
      let painting = false;
      let currentColor = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = currentColor;

      function getPos(e) {
        const r = canvas.getBoundingClientRect();
        const scaleX = canvas.width / r.width;
        const scaleY = canvas.height / r.height;
        if (e.touches) {
          return { x: (e.touches[0].clientX - r.left) * scaleX, y: (e.touches[0].clientY - r.top) * scaleY };
        }
        return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
      }

      canvas.addEventListener('mousedown',  e => { painting = true; ctx.beginPath(); const p=getPos(e); ctx.moveTo(p.x,p.y); });
      canvas.addEventListener('mousemove',  e => { if (!painting) return; const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); });
      canvas.addEventListener('mouseup',    () => painting = false);
      canvas.addEventListener('mouseleave', () => painting = false);
      canvas.addEventListener('touchstart', e => { e.preventDefault(); painting = true; ctx.beginPath(); const p=getPos(e); ctx.moveTo(p.x,p.y); }, {passive:false});
      canvas.addEventListener('touchmove',  e => { e.preventDefault(); if (!painting) return; const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); }, {passive:false});
      canvas.addEventListener('touchend',   () => painting = false);

      function setColor(btn) {
        currentColor = btn.dataset.clr;
        ctx.strokeStyle = currentColor;
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      function downloadCanvas() {
        const a = document.createElement('a');
        a.download = 'drawing.png';
        a.href = canvas.toDataURL();
        a.click();
      }

      // Template
      let cardCount = 0;
      function addCard() {
        cardCount++;
        const tpl = document.getElementById('cardTpl');
        const clone = tpl.content.cloneNode(true);
        const now = new Date().toLocaleTimeString();
        clone.querySelector('.tpl-title').textContent = 'Item #' + cardCount;
        clone.querySelector('.tpl-time').textContent = 'Added at: ' + now;
        document.getElementById('tplOutput').appendChild(clone);
      }

      // data-* badges
      function showData(el) {
        const d = el.dataset;
        document.getElementById('dataOut').innerHTML =
          'role: <b>' + d.role + '</b> &nbsp;|&nbsp; id: <b>' + d.id + '</b>';
      }

      // hidden toggle
      function toggleHidden() {
        const el = document.getElementById('hiddenEl');
        el.hidden ? el.removeAttribute('hidden') : el.setAttribute('hidden', '');
      }


      // Draggable
      const originalText = document.getElementById('editBox') ? document.getElementById('editBox').innerHTML : '';
      let draggedEl = null;

      document.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', () => {
          draggedEl = item;
          setTimeout(() => item.classList.add('dragging'), 0);
        });
        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          draggedEl = null;
        });
      });

      const dropZone = document.getElementById('dropZone');
      dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (draggedEl) {
          // Remove placeholder text if present
          if (dropZone.querySelector('em') || dropZone.textContent.trim() === 'Drop chips here…') {
            dropZone.textContent = '';
          }
          dropZone.appendChild(draggedEl);
        }
      });

      document.getElementById('resetDrag').addEventListener('click', () => {
        const source = document.getElementById('dragSource');
        document.querySelectorAll('.drag-item').forEach(item => source.appendChild(item));
        dropZone.textContent = 'Drop chips here…';
      });

      // Respect OS preference if no saved preference
      if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
