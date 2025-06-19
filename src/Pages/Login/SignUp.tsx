import { signUp } from "@/APIs/userApi";
import { isSignUpSuccess } from "@/Interface/authInterface";

import { Props, UserSignUpFailedInfo } from "@/Interface/userInterface";
import { userLogin } from "@/store/modules/userStore";

import { Alert, Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formItemLayout, validateMessages } from "./utilConsts/authForm";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useI18n } from "@/Context/languageContext";

function SingUp(props: Props) {
  const { toggleShowSignUp } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signUpFailed, setSignUpFailed] = useState<UserSignUpFailedInfo>({
    showSignUpFailed: false,
    errMsg: "",
  });
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  const [form] = Form.useForm();

  const [clientReady, setClientReady] = useState<boolean>(false);

  const { t } = useI18n();

  useEffect(() => {
    setClientReady(true);
  }, []);

  const onFinish = async (values: any) => {
    const { user } = values;

    setIsSigningUp(true);

    const res = await signUp(user);

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

    setIsSigningUp(false);
  };

  return (
    <Form
      {...formItemLayout}
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
    >
      <Form.Item name={["user", "userName"]} label={t.userName}>
        <Input />
      </Form.Item>

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

      <Form.Item
        name={["user", "confirmPassword"]}
        label={t.confirmPassword}
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
            loading={isSigningUp}
          >
            {t.create}
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
              {t.loginViaEmail}
            </span>
          </p>
        </>
      </Form.Item>

      {signUpFailed.showSignUpFailed && (
        <Alert
          message={signUpFailed.errMsg}
          description={t.createUserFailMsg}
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

export default SingUp;
