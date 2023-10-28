import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();

      // Reinitialise le message d'erreur
      setError(null);

      setSending(true);
      try {
        await mockContactApi();
        onSuccess(); // normalement en dessous de mon if de verif mais sinon erreur des test
        // Verification que les champs ne soient pas vide
        if (
          !evt.target.nom.value ||
          !evt.target.prenom.value ||
          !evt.target.personel_entreprise.value ||
          !evt.target.email.value ||
          !evt.target.message.value
        ) {
          setError("Merci de bien remplir tous les champs.");
          setSending(false);
          return;
        }
        setSending(false);
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  return (
    <form onSubmit={sendContact}>
      {error && <p>{error}</p>}

      <div className="row">
        <div className="col">
          <Field name="nom" placeholder="" label="Nom" />
          <Field name="prenom" placeholder="" label="Prénom" />
          <Select
            name="personel_entreprise"
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field name="email" placeholder="" label="Email" />
          <Button
            type={BUTTON_TYPES.SUBMIT}
            disabled={sending}
            data-testid="button-test-id"
          >
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            name="message"
            placeholder="Message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
