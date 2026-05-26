# Assignment: MASA App Clone with Expo

## Overview

In this group assignment, you will recreate the core experience of the MASA mobile application using Expo.

Reference apps:

- Android: https://play.google.com/store/apps/details?id=com.labmu.masa&hl=id
- iOS: https://apps.apple.com/id/app/masa/id6753329539

You are not required to reproduce every feature in the original app. Your goal is to build a polished functional clone that demonstrates the required mobile development skills listed below.

Use your own assets, icons, copy, and branding where needed. Do not reuse proprietary assets from the original application.

## Assignment Type

- Format: Group assignment
- Group size: 3-4 students per group
- Framework: Expo
- Submission platform: GitHub Classroom
- Deadline: **8 June, 23:59**

## Learning Outcomes

By the end of this assignment, your group must demonstrate the ability to:

1. Use Expo Router for navigation.
2. Build authentication and user management using Clerk.
3. Integrate and consume third-party APIs.
4. Use EAS for building and deployment workflows.
5. Deliver a standalone mobile app that runs without connecting to the Expo development server.

## Task

Build a MASA-inspired mobile application with Expo. Your app should replicate the overall structure and main user flows of the original application closely enough that users can recognize the product direction, while still using your own implementation and assets.

Your group should study the app, identify its core screens and user journeys, then implement a working version with good UI structure, navigation, data flow, and deployable builds.

## Minimum Technical Requirements

Your submission must satisfy all requirements below.

### 1. Expo Project

- The app must be built using Expo.
- The codebase must be organized clearly and be runnable by the teaching team.
- The repository must include all required configuration and setup instructions.

### 2. Navigation with Expo Router

- The app must use Expo Router.
- Navigation must include multiple screens.
- Navigation structure should be meaningful and suitable for the app flow.
- Use layouts, nested routes, tabs, stacks, or modal routes where appropriate.

### 3. Third-Party API Integration

### 3. Authentication and User Management with Clerk

- The app must use Clerk for authentication and user management.
- Users must be able to sign up, sign in, and sign out.
- The app must include protected routes or protected screens for authenticated users.
- The app must display basic user account information for the signed-in user.
- Session state must be handled correctly across the app.

Examples of acceptable user management features:

- Sign up and sign in flow
- Persistent authenticated session
- Profile or account screen
- Access control for authenticated-only screens

### 4. Third-Party API Integration

- The app must use at least one real third-party API.
- The API must be meaningfully integrated into the app experience.
- Loading, success, and error states must be handled properly.
- Data must be displayed in a usable and readable way.

Clerk does not count as the third-party API requirement for this section. You must integrate at least one additional external API beyond authentication.

Examples of acceptable API usage:

- News, content, or media API
- Maps, location, weather, or place data
- Recommendation, catalog, or commerce API
- Any other external API approved by the instructor

### 5. EAS Usage

- The project must be configured for EAS.
- Your repository must include the relevant EAS configuration files.
- Your group must produce at least one standalone build using EAS.
- The build process should be documented in the repository.

### 6. Standalone App Delivery

- The final app must run without the Expo development server.
- The teaching team must be able to install or access a standalone build.
- A development-only submission is not sufficient.

Acceptable submission evidence includes:

- Android APK or Android internal distribution build
- EAS build link
- iOS build link or TestFlight link, if available
- Clear installation instructions for the delivered build

## Functional Expectations

Your app should include a realistic set of features inspired by the MASA app. The exact scope is up to your group, but the app should feel complete rather than a collection of disconnected screens.

MASA is a Muslim lifestyle application that provides practical worship-related features such as prayer schedules, qibla direction, a digital Al-Qur'an with tajwid support, daily prayers, and other worship guidance. The app is developed by Muhammadiyah Software Labs with a focus on supporting Muslim users through moderation, usability, and accuracy.

The features below are recommended because they are aligned with the real MASA app. They are not all mandatory, but your group is encouraged to use them as inspiration when defining project scope.

Suggested expectations:

- Splash or landing experience
- Authentication flow with Clerk
- Home screen
- Content listing or dashboard screen
- Detail screen
- User interaction flow such as save, bookmark, register, filter, search, or similar
- Profile, settings, or account-related screen

Recommended MASA-inspired features:

- Prayer schedule display
- Qibla direction feature
- Digital Al-Qur'an screen with tajwid-friendly presentation
- Daily prayers or doa collection
- Worship guidance or Islamic lifestyle content
- Location-aware religious utility feature, if relevant to your app design

You may adjust the feature set based on your interpretation of the reference app, but your implementation must be coherent and substantial.

## GitHub Classroom Submission

Each group must accept the assignment using the GitHub Classroom link provided by the instructor.

### Required Workflow

1. One member creates or accepts the group assignment in GitHub Classroom.
2. All group members join the same group repository.
3. The group uses the classroom repository as the main submission repository.
4. All development work must be committed to that repository.

### Repository Requirements

Your GitHub Classroom repository must include:

- Complete source code
- A clear commit history showing group contribution
- `README.md` with setup, build, and submission instructions
- `app/` route structure or equivalent Expo Router setup
- Clerk integration and environment setup instructions
- `eas.json` and related Expo/EAS configuration

## Deliverables

Submit all of the following in your GitHub Classroom repository:

1. The complete Expo project source code.
2. A `README.md` that explains:
   - Group members and student IDs
   - Project overview
   - Features implemented
   - Clerk authentication and user management flow
   - APIs used
   - How to run the app locally
   - How to build the app with EAS
   - How to access/install the standalone build
3. A standalone build deliverable.
4. Screenshots or short screen recordings of the app.
5. A short explanation of which parts of the original MASA app were implemented and what adaptations were made.

## Recommended Team Structure

Groups should distribute work clearly. A healthy division of work may include:

- Navigation and app architecture
- UI implementation and reusable components
- API integration and state handling
- Build, release, testing, and documentation

All members are expected to contribute meaningfully.

## Evaluation Criteria

Your work will be evaluated based on the following:

1. Correct use of Expo Router.
2. Correct implementation of Clerk authentication and user management.
3. Quality and relevance of third-party API integration.
4. Correct EAS configuration and successful standalone build delivery.
5. App completeness, polish, and usability.
6. Code quality and project organization.
7. Documentation quality.
8. Evidence of meaningful team collaboration.

## Submission Checklist

Before the deadline, make sure your group has completed all items below:

- Joined the correct GitHub Classroom group repository
- Added all group members to the README
- Implemented navigation using Expo Router
- Implemented authentication and user management using Clerk
- Integrated at least one third-party API
- Configured EAS successfully
- Produced a standalone app build
- Added setup and build instructions
- Added screenshots or demo evidence
- Verified the repository is accessible and complete

## Deadline

Submission deadline: **8 June, 23:59**

Late submissions follow the course policy.

## Notes

- Start early. EAS build setup and mobile deployment usually take longer than expected.
- Test your app on a real device whenever possible.
- Keep your scope realistic. A smaller, well-finished app is better than a large but incomplete one.
- Make regular commits with meaningful messages.