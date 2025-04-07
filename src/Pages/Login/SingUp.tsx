import { signUp } from "@/APIs/userApi";
import { isSignUpSuccess } from "@/Interface/authInterface";

import { Props, UserSignUpFailedInfo } from "@/Interface/userInterface";
import { userLogin } from "@/store/modules/userStore";

import { Alert, Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formItemLayout, validateMessages } from "./utilConsts/authForm";

function SingUp(props: Props) {
  const { toggleShowSignUp } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signUpFailed, setSignUpFailed] = useState<UserSignUpFailedInfo>({
    showSignUpFailed: false,
    errMsg: "",
  });

  const [form] = Form.useForm();

  const [clientReady, setClientReady] = useState<boolean>(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const onFinish = async (values: any) => {
    const { user } = values;

    const res = await signUp(user);

    if (isSignUpSuccess(res)) {
      navigate("/dashboard");
      dispatch(userLogin(res));
    } else
      setSignUpFailed({
        showSignUpFailed: true,
        errMsg: res.error ? res.error : "error",
      });
  };

  return (
    <Form
      {...formItemLayout}
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
    >
      <Form.Item name={["user", "username"]} label="Name">
        <Input />
      </Form.Item>

      <Form.Item
        name={["user", "email"]}
        label="Email"
        rules={[{ type: "email", required: true }]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        name={["user", "password"]}
        label="Password"
        rules={[{ required: true }]}
      >
        <Input type="password" />
      </Form.Item>

      <Form.Item
        name={["user", "confirmPassword"]}
        label="Confirm Password"
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
          >
            Submit
          </Button>
          <p>
            or{" "}
            <span
              style={{
                textDecoration: "underline",
                color: "#11f",
                cursor: "pointer",
              }}
              onClick={toggleShowSignUp}
            >
              Login with existing email
            </span>
          </p>
        </>
      </Form.Item>

      {signUpFailed.showSignUpFailed && (
        <Alert
          message={signUpFailed.errMsg}
          description="Sign"
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
