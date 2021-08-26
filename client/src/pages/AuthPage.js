import React, { useState } from "react";
import { useHttp } from "./hooks/http.hook";

export const AuthPage = () => {
  const { loading, error, request } = useHttp();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      console.log("data: " + data);
    } catch (error) {}
  };
  return (
    <div className="row">
      <div>
        <h3>РОЗКЛАД ЗАНЯТЬ економічного факультету КНУ</h3>
      </div>
      <div className="col s6 offset-s3">
        <div className="card" style={{ background: "#034853" }}>
          <div
            className="card-content white-text"
            style={{ background: "#045B68" }}
          >
            <span className="card-title">Авторизація</span>
            <div className="input-field">
              <input
                placeholder="Введіть email"
                id="first_name"
                type="email"
                name="email"
                class="validate"
                onChange={changeHandler}
              />
              <label htmlFor="first_name">Email</label>
            </div>
            <div className="input-field">
              <input
                placeholder="Введіть пароль"
                id="password"
                type="password"
                name="password"
                class="validate"
                onChange={changeHandler}
              />
              <label htmlFor="password">Пароль</label>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn"
              style={{ marginRight: 15, background: "#F78B10" }}
              disabled={loading}
            >
              Увійти
            </button>
            <button
              className="btn"
              style={{ background: "#808080" }}
              onClick={registerHandler}
              disabled={loading}
            >
              Реєстрація
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
