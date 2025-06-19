import { signIn } from "@/APIs/userApi";
import { isSignUpSuccess } from "@/Interface/authInterface";

import { Props, UserSignUpFailedInfo } from "@/Interface/userInterface";

import { Alert, Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formItemLayout, validateMessages } from "./utilConsts/authForm";
import { userLogin } from "@/store/modules/userStore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useI18n } from "@/Context/languageContext";

function Login(props: Props) {
  const { toggleShowSignUp } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signUpFailed, setSignUpFailed] = useState<UserSignUpFailedInfo>({
    showSignUpFailed: false,
    errMsg: "",
  });

  const [isLogingIn, setIsLogingIn] = useState<boolean>(false);

  const [form] = Form.useForm();

  const [clientReady, setClientReady] = useState<boolean>(false);

  const { t } = useI18n();

  useEffect(() => {
    setClientReady(true);
  }, []);

  const onFinish = async (values: any) => {
    const { user } = values;

    setIsLogingIn(true);

    const res = await signIn(user);

    if (isSignUpSuccess(res)) {
      const auth = getAuth();
      const userCredential = await signInWithCustomToken(auth, res.token);
      const firebaseIdToken = await userCredential.user.getIdToken();

      if (!firebaseIdToken) {
        setSignUpFailed({
          showSignUpFailed: true,
          errMsg: "Invalid firebase id token detected",
        });
        return;
      } else res.token = firebaseIdToken;

      navigate("/");
      dispatch(userLogin(res));
    } else
      setSignUpFailed({
        showSignUpFailed: true,
        errMsg: res.error ? res.error : "error",
      });

    setIsLogingIn(false);
  };

  return (
    <Form
      {...formItemLayout}
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={["user", "email"]}
        label={t.email}
        rules={[{ type: "email", required: true }]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        name={["user", "password"]}
        label={t.password}
        rules={[{ required: true }]}
      >
        <Input type="password" />
      </Form.Item>

      <Form.Item label={null}>
        <>
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !clientReady ||
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length
            }
            loading={isLogingIn}
          >
            {t.signIn}
          </Button>
          <p>
            {t.or + " "}
            <span
              style={{
                textDecoration: "underline",
                color: "#11f",
                cursor: "pointer",
              }}
              onClick={toggleShowSignUp}
            >
              {t.createNewUser}
            </span>
          </p>
        </>
      </Form.Item>

      {signUpFailed.showSignUpFailed && (
        <Alert
          message={signUpFailed.errMsg}
          description={t.loginFailMsg}
          type="error"
          showIcon
          closable
          afterClose={() =>
            setSignUpFailed({
              showSignUpFailed: false,
              errMsg: "",
            })
          }
        />
      )}
    </Form>
  );
}

export default Login;
