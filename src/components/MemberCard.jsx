import { Link } from "react-router-dom";

export default function MemberCard({ miembro }) {
  return (
    <article className="member-card">
      <div className="avatar-wrapper">
        <img src={miembro.avatar} alt={`Avatar ${miembro.nombre}`} />
      </div>
      <h3 className="member-name">{miembro.nombre}</h3>
      <p className="member-meta">
        {miembro.ubicacion.split(" ")[0]} · {miembro.edad}
      </p>
      <p className="member-bio-preview">
        « {miembro.rol.split("&")[0].trim()} »
      </p>
      <Link
        to={`/perfil/${miembro.id}`}
        className="btn btn-outline"
        style={{ width: "100%" }}
      >
        Ver Perfil 🡺 {miembro.nombre.split(" ")[0]}
      </Link>
    </article>
  );
}
