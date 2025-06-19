import { useI18n } from "@/Context/languageContext";
import { SAVED_LANGUAGE_PREFERENCE } from "@/util/const";
import { TranslationOutlined } from "@ant-design/icons";

function ToggleLanguageButton() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "zh" : "en";
    setLanguage(newLanguage);
    localStorage.setItem(SAVED_LANGUAGE_PREFERENCE, newLanguage);
  };

  return (
    <div
      style={{ display: "flex", columnGap: "5px", cursor: "pointer" }}
      onClick={toggleLanguage}
    >
      <TranslationOutlined
        style={{ color: "#fff", cursor: "pointer", fontSize: "20px" }}
      />
      <div>
        <span
          style={{
            color: language === "en" ? "white" : "grey",
            textDecoration: language === "en" ? "underline" : "",
          }}
        >
          ENG
        </span>
        <span
          style={{
            color: "white",
            padding: "0 5px",
          }}
        >
          /
        </span>
        <span
          style={{
            color: language === "zh" ? "white" : "grey",
            textDecoration: language === "zh" ? "underline" : "",
          }}
        >
          中文
        </span>
      </div>
    </div>
  );
}

export default ToggleLanguageButton;
