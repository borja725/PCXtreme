import React, { useEffect, useState } from 'react';

export default function ResumenResenasProducto({ productId }) {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/productos/${productId}/reviews`)
      .then(res => res.json())
      .then(data => {
        setResenas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) return <span style={{ color: '#ccc' }}>★★★★★</span>;

  const media = resenas.length ? (resenas.reduce((acc, r) => acc + Number(r.rating), 0) / resenas.length) : 0;
  return (
    <span>
      <span style={{ color: '#fbc02d', fontSize: 15 }}>{'★'.repeat(Math.round(media))}{'☆'.repeat(5 - Math.round(media))}</span>
      <span style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>({resenas.length})</span>
    </span>
  );
}
