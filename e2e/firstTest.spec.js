describe("Login flow", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("Should have login screen", async () => {
    await expect(element(by.id("loginView"))).toBeVisible();
  });

  it("Should have user ID input", async () => {
    await expect(element(by.id("userIDInput"))).toBeVisible();
  });

  it("Should have password input", async () => {
    await expect(element(by.id("passwordInput"))).toBeVisible();
  });

  it("Should have sign in button", async () => {
    await expect(element(by.id("signInButton"))).toBeVisible();
  });

  it("Should display error on empty inputs", async () => {
    await element(by.id("signInButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should display error whenever there exists an empty input", async () => {
    await element(by.id("userIDInput")).typeText("1");
    await element(by.id("signInButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("userIDInput")).clearText();
    await element(by.id("passwordInput")).typeText("123");
    await element(by.id("signInButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should display confirmation when login is ok", async () => {
    await element(by.id("userIDInput")).typeText("1");
    await element(by.id("passwordInput")).typeText("123");
    await element(by.id("signInButton")).tap();
    await expect(element(by.text("Signed in successfully!"))).toBeVisible();
    await element(by.text("OK")).tap();
  });
});

/************************************************************************************/

describe("Sign up flow", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id("signUpButton")).tap();
  });

  it("Should have sign up screen", async () => {
    await expect(element(by.id("signUpView"))).toBeVisible();
  });

  it("Should display an error whenever a field is left empty & display success message when all fields are filled", async () => {
    await element(by.id("signUpYearLevelInput")).typeText("1");
    await element(by.id("signUpScrollView")).swipe("up", "fast");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpScrollView")).scroll(500, "up");
    await element(by.id("signUpCoursesInput")).typeText("1");
    await element(by.id("signUpScrollView")).swipe("up", "fast");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpScrollView")).scroll(400, "up");
    await element(by.id("signUpSexInput")).typeText("1");
    await element(by.id("signUpScrollView")).swipe("up", "fast");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpScrollView")).scroll(300, "up");
    await element(by.id("signUpKindnessPrefInput")).typeText("4");
    await element(by.id("signUpScrollView")).swipe("up", "fast");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpScrollView")).scroll(300, "up");
    await element(by.id("signUpPatiencePrefInput")).typeText("4");
    await element(by.id("signUpScrollView")).swipe("up", "fast");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpScrollView")).scroll(300, "up");
    await element(by.id("signUpHardworkingPrefInput")).typeText("4");
    await element(by.id("signUpScrollView")).swipe("up", "fast");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpScrollView")).scroll(200, "up");
    await element(by.id("signUpUserIDInput")).typeText("1");
    await element(by.id("signUpScrollView")).swipe("up", "fast");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpPasswordInput")).typeText("123");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpEmailInput")).typeText("pepe@hands.com");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("signUpNameInput")).typeText("Pepe");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("Signed up successfully!"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should display an error if the sum of preferences is less than 12", async () => {
    await element(by.id("signUpYearLevelInput")).typeText("1");
    await element(by.id("signUpCoursesInput")).typeText("1");
    await element(by.id("signUpSexInput")).typeText("1");
    await element(by.id("signUpKindnessPrefInput")).typeText("1");
    await element(by.id("signUpScrollView")).scroll(300, "down");
    await element(by.id("signUpPatiencePrefInput")).typeText("2");
    await element(by.id("signUpHardworkingPrefInput")).typeText("3");
    await element(by.id("signUpUserIDInput")).typeText("1");
    await element(by.id("signUpScrollView")).scroll(300, "down");
    await element(by.id("signUpPasswordInput")).typeText("123");
    await element(by.id("signUpEmailInput")).typeText("pepe@hands.com");
    await element(by.id("signUpNameInput")).typeText("Pepe");
    await element(by.id("sendSignUpRequestButton")).tap();
    await expect(element(by.text("The sum of Kindness, Patience and Hardworking must be at least 12"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should go back properly using the Go Back button", async () => {
    await element(by.id("signUpScrollView")).scroll(600, "down");
    await element(by.id("signUpGoBackButton")).tap();
    await expect(element(by.id("loginView"))).toBeVisible();
  });
});

/************************************************************************************/

describe("Calendar uses flow", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id("userIDInput")).typeText("1");
    await element(by.id("passwordInput")).typeText("123");
    await element(by.id("signInButton")).tap();
    await expect(element(by.text("Signed in successfully!"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should have calendar screen", async () => {
    await expect(element(by.id("calendarView"))).toBeVisible();
  });

  it("Should be able to scroll/swipe in 4 directions", async () => {
    await element(by.id("calendarScrollView")).swipe("left", "slow");
    await element(by.id("calendarScrollView")).swipe("right", "slow");
    await element(by.id("calendarScrollView")).scroll(300, "down");
    await element(by.id("calendarScrollView")).scroll(300, "up");
    await expect(element(by.id("calendarView"))).toBeVisible();
  });

  it("Should be able to see Update indication when scroll up", async () => {
    await element(by.id("calendarScrollView")).swipe("down", "fast");
    await expect(element(by.id("calendarRefresh"))).toBeVisible();
  });

  it("Should be able to see input form when adding new schedule to calendar", async () => {
    await element(by.id("calendarMainButton")).tap();
    await element(by.id("calendarNewScheduleButton")).tap();
    await expect(element(by.id("calendarAddView"))).toBeVisible();
  });

  it("Should display an error whenever a field is left empty & display success message when all fields are filled", async () => {
    await element(by.id("calendarMainButton")).tap();
    await element(by.id("calendarNewScheduleButton")).tap();
    await element(by.id("calendarDateInput")).typeText("1");
    await element(by.id("calendarAddScrollView")).swipe("up", "fast");
    await element(by.id("calendarAddButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("calendarAddScrollView")).swipe("down", "fast");
    await element(by.id("calendarStartTimeInput")).typeText("01 30");
    await element(by.id("calendarAddScrollView")).swipe("up", "fast");
    await element(by.id("calendarAddButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("calendarEndTimeInput")).typeText("05 30");
    await element(by.id("calendarAddButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("calendarSubjectInput")).typeText("CPEN 321");
    await element(by.id("calendarAddButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("calendarLocationInput")).typeText("MCLD 322");
    await element(by.id("calendarAddButton")).tap();
    await expect(element(by.text("Added schedule successfully!"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should go back properly using the Go Back button", async () => {
    await element(by.id("calendarMainButton")).tap();
    await element(by.id("calendarNewScheduleButton")).tap();
    await element(by.id("calendarAddScrollView")).swipe("up", "fast");
    await element(by.id("calendarGoBackButton")).tap();
    await expect(element(by.id("calendarView"))).toBeVisible();
  });

  it("Should be able to see potential matches when clicking on Potential Matches button", async () => {
    await element(by.id("calendarMainButton")).tap();
    await element(by.id("calendarGetMatchesButton")).tap();
    await expect(element(by.text("Potential matches:\nundefined"))).toBeVisible();
    await element(by.text("OK")).tap();
  });
});

/************************************************************************************/

describe("Profile uses flow", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id("userIDInput")).typeText("1");
    await element(by.id("passwordInput")).typeText("123");
    await element(by.id("signInButton")).tap();
    await expect(element(by.text("Signed in successfully!"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profileTab")).tap();
  });

  it("Should have profile screen", async () => {
    await expect(element(by.id("profileView"))).toBeVisible();
  });

  it("Should be able to scroll/swipe", async () => {
    await element(by.id("profileScrollView")).swipe("up", "slow");
    await element(by.id("profileScrollView")).swipe("down", "slow");
    await expect(element(by.id("calendarView"))).toBeVisible();
  });

  it("Should be able to see Update indication when scroll up", async () => {
    await element(by.id("profileScrollView")).swipe("down", "fast");
    await expect(element(by.id("profileRefresh"))).toBeVisible();
  });

  it("Should be able to see input form when adding new schedule to calendar", async () => {
    await element(by.id("profileMainButton")).tap();
    await element(by.id("profileChangeProfile")).tap();
    await expect(element(by.id("profileChangeProfileView"))).toBeVisible();
  });

  it("Should display an error whenever a field is left empty", async () => {
    await element(by.id("profileMainButton")).tap();
    await element(by.id("profileChangeProfile")).tap();
    await element(by.id("profileNameInput")).clearText();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profileChangeProfileScrollView")).scroll(500, "up");
    await element(by.id("profilePasswordInput")).clearText();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profileChangeProfileScrollView")).scroll(400, "up");
    await element(by.id("profileYearLevelInput")).clearText();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profileChangeProfileScrollView")).scroll(300, "up");
    await element(by.id("profileSexInput")).clearText();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profileChangeProfileScrollView")).scroll(300, "up");
    await element(by.id("profileEmailInput")).clearText();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profileChangeProfileScrollView")).scroll(300, "up");
    await element(by.id("profileCoursesInput")).clearText();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profileChangeProfileScrollView")).scroll(200, "up");
    await element(by.id("profileKindnessInput")).clearText();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profilePatienceInput")).clearText();
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
    await element(by.id("profileHardworkingInput")).clearText();
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("One of the fields must not be NULL or empty"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should display an error whenever the sum of the preferences is less than 12", async () => {
    await element(by.id("profileMainButton")).tap();
    await element(by.id("profileChangeProfile")).tap();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileKindnessInput")).clearText();
    await element(by.id("profileKindnessInput")).typeText("1");
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profilePatienceInput")).clearText();
    await element(by.id("profilePatienceInput")).typeText("2");
    await element(by.id("profileHardworkingInput")).clearText();
    await element(by.id("profileHardworkingInput")).typeText("3");
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("The sum of Kindness, Patience and Hardworking must be at least 12"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should display a success message if nothing changes/some fields change", async () => {
    await element(by.id("profileMainButton")).tap();
    await element(by.id("profileChangeProfile")).tap();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    /* This is to suppress the current database information - I initialized this incorrectly so the sum of these 3 are always < 12 */
    await element(by.id("profileKindnessInput")).clearText();
    await element(by.id("profileKindnessInput")).typeText("4");
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profilePatienceInput")).clearText();
    await element(by.id("profilePatienceInput")).typeText("4");
    await element(by.id("profileHardworkingInput")).clearText();
    await element(by.id("profileHardworkingInput")).typeText("4");
    /* Will be removed when test data is reinitialized */
    await element(by.id("profileChangeButton")).tap();
    await expect(element(by.text("Updated successfully!"))).toBeVisible();
    await element(by.text("OK")).tap();
  });

  it("Should go back properly using the Go Back button", async () => {
    await element(by.id("profileMainButton")).tap();
    await element(by.id("profileChangeProfile")).tap();
    await element(by.id("profileChangeProfileScrollView")).swipe("up", "fast");
    await element(by.id("profileChangeGoBack")).tap();
    await expect(element(by.id("profileView"))).toBeVisible();
  });

  it("Should be able to sign out properly using the Sign Out button", async () => {
    await element(by.id("profileMainButton")).tap();
    await element(by.id("profileSignOut")).tap();
    await expect(element(by.text("Signing out"))).toBeVisible();
    await element(by.text("OK")).tap();
    await expect(element(by.id("loginView"))).toBeVisible();
  });
});