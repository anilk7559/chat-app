import { useState } from 'react';
import { Button } from 'react-bootstrap';
import OtpInput from 'react-otp-input';
import { connect, ConnectedProps } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from 'src/redux/auth/actions';
import { authService, userService } from 'src/services';

const mapStates = (state: any) => ({
  authUser: state.auth.authUser
});

const mapDispatch = { handleLogout: logout };

const connector = connect(mapStates, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

function DeactiveProfileForm({
  authUser,
  handleLogout
}: PropsFromRedux) {
  const [code, setCode] = useState('');
  const [disabled, setDisabled] = useState(false);

  const deactive = async () => {
    try {
      await authService.doVerifyCode({
        email: authUser.email,
        verifyCode: code
      });
      await authService.deactiveProfile();

      // log out?
      toast.success('Ihr Konto wurde deaktiviert!');
      handleLogout();
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || err?.msg || 'Ein Fehler ist aufgetreten, bitte versuchen Sie es erneut!');
      setDisabled(false);
    }
  };

  const onChangeCode = (value: any) => {
    if (!/^[0-9_-]*$/.test(value)) {
      toast.error('Bitte nur numerische Zeichen eingeben');
      return;
    }
    setCode(value);
    if (value.length === 4) {
      setDisabled(true);
      deactive();
    }
  };

  const getOTP = async () => {
    if (
      window.confirm(
        'Andere Fans oder Models können dich nicht mehr kontaktieren, wenn du dein Profil deaktivierst. Sind Sie sicher?'
      )
    ) {
      await userService.getOTP().then(() => toast.success('Überprüfungscode wurde gesendet!'));
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">Account deaktivieren</div>
      <div className="card-body card-bg-1">
        <p>OTP wird an Ihre E-Mail gesendet. Bitte geben Sie es unten ein.</p>
        <OtpInput
          containerStyle="main-input-otp"
          inputStyle="input-otp-mini"
          onChange={onChangeCode}
          numInputs={4}
          value={code}
          shouldAutoFocus={false}
          isDisabled={disabled}
        />
      </div>
      <div className="card-footer d-flex justify-content-end">
        <Button variant="primary" type="button" onClick={getOTP.bind(this)}>
          Account deaktivieren
        </Button>
      </div>
    </div>
  );
}
export default connector(DeactiveProfileForm);
