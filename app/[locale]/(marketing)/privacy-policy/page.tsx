import { unstable_setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return (
    <article className="container max-w-6xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-3xl lg:text-4xl">
          Privacy
        </h1>
        <p className="text-base text-muted-foreground">
          Please read our privacy policy.
        </p>
      </div>
      <hr className="my-4" />
      <div className="mdx">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Last updated: Jane 18, 2024
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We use Your Personal data to provide and improve the Service. By using
          the Service, You agree to the collection and use of information in
          accordance with this Privacy Policy. This Privacy Policy has been
          created with the help of the{" "}
          <a
            className="font-medium underline underline-offset-4"
            href="https://www.freeprivacypolicy.com/free-privacy-policy-generator/"
          >
            Free Privacy Policy Generator
          </a>
          .
        </p>
        <h2
          className="mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0"
          id="interpretation-and-definitions"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#interpretation-and-definitions"
          >
            <span className="icon icon-link" />
          </a>
          Interpretation and Definitions
        </h2>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="interpretation"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#interpretation"
          >
            <span className="icon icon-link" />
          </a>
          Interpretation
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions. The following definitions
          shall have the same meaning regardless of whether they appear in
          singular or in plural.
        </p>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="definitions"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#definitions"
          >
            <span className="icon icon-link" />
          </a>
          Definitions
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          For the purposes of this Privacy Policy:
        </p>
        <ul className="my-6 ml-6 list-disc">
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Account</strong> means a unique account created for You to
              access our Service or parts of our Service.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Affiliate</strong> means an entity that controls, is
              controlled by or is under common control with a party, where
              "control" means ownership of 50% or more of the shares, equity
              interest or other securities entitled to vote for election of
              directors or other managing authority.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Company</strong> (referred to as either "the Company",
              "We", "Us" or "Our" in this Agreement) refers to FluxAIProTeam.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Cookies</strong> are small files that are placed on Your
              computer, mobile device or any other device by a website,
              containing the details of Your browsing history on that website
              among its many uses.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Country</strong> refers to: China
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Device</strong> means any device that can access the
              Service such as a computer, a cellphone or a digital tablet.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Personal Data</strong> is any information that relates to
              an identified or identifiable individual.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Service</strong> refers to the Website.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Service Provider</strong> means any natural or legal
              person who processes the data on behalf of the Company. It refers
              to third-party companies or individuals employed by the Company to
              facilitate the Service, to provide the Service on behalf of the
              Company, to perform services related to the Service or to assist
              the Company in analyzing how the Service is used.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Usage Data</strong> refers to data collected
              automatically, either generated by the use of the Service or from
              the Service infrastructure itself (for example, the duration of a
              page visit).
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Website</strong> refers to FluxAIProTeam, accessible from{" "}
              <a
                className="font-medium underline underline-offset-4"
                href="https://fluxaipro.art"
              >
                https://fluxaipro.art
              </a>
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>You</strong> means the individual accessing or using the
              Service, or the company, or other legal entity on behalf of which
              such individual is accessing or using the Service, as applicable.
            </p>
          </li>
        </ul>
        <h2
          className="mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0"
          id="collecting-and-using-your-personal-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#collecting-and-using-your-personal-data"
          >
            <span className="icon icon-link" />
          </a>
          Collecting and Using Your Personal Data
        </h2>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="types-of-data-collected"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#types-of-data-collected"
          >
            <span className="icon icon-link" />
          </a>
          Types of Data Collected
        </h3>
        <h4
          className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
          id="personal-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#personal-data"
          >
            <span className="icon icon-link" />
          </a>
          Personal Data
        </h4>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information that can be used to contact or
          identify You. Personally identifiable information may include, but is
          not limited to:
        </p>
        <ul className="my-6 ml-6 list-disc">
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Email address
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">Usage Data</p>
          </li>
        </ul>
        <h4
          className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
          id="usage-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#usage-data"
          >
            <span className="icon icon-link" />
          </a>
          Usage Data
        </h4>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Usage Data is collected automatically when using the Service.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Usage Data may include information such as Your Device's Internet
          Protocol address (e.g. IP address), browser type, browser version, the
          pages of our Service that You visit, the time and date of Your visit,
          the time spent on those pages, unique device identifiers and other
          diagnostic data.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          When You access the Service by or through a mobile device, We may
          collect certain information automatically, including, but not limited
          to, the type of mobile device You use, Your mobile device unique ID,
          the IP address of Your mobile device, Your mobile operating system,
          the type of mobile Internet browser You use, unique device identifiers
          and other diagnostic data.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We may also collect information that Your browser sends whenever You
          visit our Service or when You access the Service by or through a
          mobile device.
        </p>
        <h4
          className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
          id="tracking-technologies-and-cookies"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#tracking-technologies-and-cookies"
          >
            <span className="icon icon-link" />
          </a>
          Tracking Technologies and Cookies
        </h4>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We use Cookies and similar tracking technologies to track the activity
          on Our Service and store certain information. Tracking technologies
          used are beacons, tags, and scripts to collect and track information
          and to improve and analyze Our Service. The technologies We use may
          include:
        </p>
        <ul className="my-6 ml-6 list-disc">
          <li className="mt-2">
            <strong>Cookies or Browser Cookies.</strong> A cookie is a small
            file placed on Your Device. You can instruct Your browser to refuse
            all Cookies or to indicate when a Cookie is being sent. However, if
            You do not accept Cookies, You may not be able to use some parts of
            our Service. Unless you have adjusted Your browser setting so that
            it will refuse Cookies, our Service may use Cookies.
          </li>
          <li className="mt-2">
            <strong>Web Beacons.</strong> Certain sections of our Service and
            our emails may contain small electronic files known as web beacons
            (also referred to as clear gifs, pixel tags, and single-pixel gifs)
            that permit the Company, for example, to count users who have
            visited those pages or opened an email and for other related website
            statistics (for example, recording the popularity of a certain
            section and verifying system and server integrity).
          </li>
        </ul>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies
          remain on Your personal computer or mobile device when You go offline,
          while Session Cookies are deleted as soon as You close Your web
          browser. Learn more about cookies on the{" "}
          <a
            className="font-medium underline underline-offset-4"
            href="https://www.freeprivacypolicy.com/blog/sample-privacy-policy-template/#Use_Of_Cookies_And_Tracking"
          >
            Free Privacy Policy website
          </a>{" "}
          article.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We use both Session and Persistent Cookies for the purposes set out
          below:
        </p>
        <ul className="my-6 ml-6 list-disc">
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Necessary / Essential Cookies</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Type: Session Cookies
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Administered by: Us
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Purpose: These Cookies are essential to provide You with services
              available through the Website and to enable You to use some of its
              features. They help to authenticate users and prevent fraudulent
              use of user accounts. Without these Cookies, the services that You
              have asked for cannot be provided, and We only use these Cookies
              to provide You with those services.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Cookies Policy / Notice Acceptance Cookies</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Type: Persistent Cookies
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Administered by: Us
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Purpose: These Cookies identify if users have accepted the use of
              cookies on the Website.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Functionality Cookies</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Type: Persistent Cookies
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Administered by: Us
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Purpose: These Cookies allow us to remember choices You make when
              You use the Website, such as remembering your login details or
              language preference. The purpose of these Cookies is to provide
              You with a more personal experience and to avoid You having to
              re-enter your preferences every time You use the Website.
            </p>
          </li>
        </ul>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          For more information about the cookies we use and your choices
          regarding cookies, please visit our Cookies Policy or the Cookies
          section of our Privacy Policy.
        </p>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="use-of-your-personal-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#use-of-your-personal-data"
          >
            <span className="icon icon-link" />
          </a>
          Use of Your Personal Data
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The Company may use Personal Data for the following purposes:
        </p>
        <ul className="my-6 ml-6 list-disc">
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>To provide and maintain our Service</strong>, including to
              monitor the usage of our Service.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>To manage Your Account:</strong> to manage Your
              registration as a user of the Service. The Personal Data You
              provide can give You access to different functionalities of the
              Service that are available to You as a registered user.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>For the performance of a contract:</strong> the
              development, compliance and undertaking of the purchase contract
              for the products, items or services You have purchased or of any
              other contract with Us through the Service.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>To contact You:</strong> To contact You by email,
              telephone calls, SMS, or other equivalent forms of electronic
              communication, such as a mobile application's push notifications
              regarding updates or informative communications related to the
              functionalities, products or contracted services, including the
              security updates, when necessary or reasonable for their
              implementation.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>To provide You</strong> with news, special offers and
              general information about other goods, services and events which
              we offer that are similar to those that you have already purchased
              or enquired about unless You have opted not to receive such
              information.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>To manage Your requests:</strong> To attend and manage
              Your requests to Us.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>For business transfers:</strong> We may use Your
              information to evaluate or conduct a merger, divestiture,
              restructuring, reorganization, dissolution, or other sale or
              transfer of some or all of Our assets, whether as a going concern
              or as part of bankruptcy, liquidation, or similar proceeding, in
              which Personal Data held by Us about our Service users is among
              the assets transferred.
            </p>
          </li>
          <li className="mt-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>For other purposes</strong>: We may use Your information
              for other purposes, such as data analysis, identifying usage
              trends, determining the effectiveness of our promotional campaigns
              and to evaluate and improve our Service, products, services,
              marketing and your experience.
            </p>
          </li>
        </ul>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We may share Your personal information in the following situations:
        </p>
        <ul className="my-6 ml-6 list-disc">
          <li className="mt-2">
            <strong>With Service Providers:</strong> We may share Your personal
            information with Service Providers to monitor and analyze the use of
            our Service, to contact You.
          </li>
          <li className="mt-2">
            <strong>For business transfers:</strong> We may share or transfer
            Your personal information in connection with, or during negotiations
            of, any merger, sale of Company assets, financing, or acquisition of
            all or a portion of Our business to another company.
          </li>
          <li className="mt-2">
            <strong>With Affiliates:</strong> We may share Your information with
            Our affiliates, in which case we will require those affiliates to
            honor this Privacy Policy. Affiliates include Our parent company and
            any other subsidiaries, joint venture partners or other companies
            that We control or that are under common control with Us.
          </li>
          <li className="mt-2">
            <strong>With business partners:</strong> We may share Your
            information with Our business partners to offer You certain
            products, services or promotions.
          </li>
          <li className="mt-2">
            <strong>With other users:</strong> when You share personal
            information or otherwise interact in the public areas with other
            users, such information may be viewed by all users and may be
            publicly distributed outside.
          </li>
          <li className="mt-2">
            <strong>With Your consent</strong>: We may disclose Your personal
            information for any other purpose with Your consent.
          </li>
        </ul>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="retention-of-your-personal-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#retention-of-your-personal-data"
          >
            <span className="icon icon-link" />
          </a>
          Retention of Your Personal Data
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The Company will retain Your Personal Data only for as long as is
          necessary for the purposes set out in this Privacy Policy. We will
          retain and use Your Personal Data to the extent necessary to comply
          with our legal obligations (for example, if we are required to retain
          your data to comply with applicable laws), resolve disputes, and
          enforce our legal agreements and policies.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The Company will also retain Usage Data for internal analysis
          purposes. Usage Data is generally retained for a shorter period of
          time, except when this data is used to strengthen the security or to
          improve the functionality of Our Service, or We are legally obligated
          to retain this data for longer time periods.
        </p>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="transfer-of-your-personal-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#transfer-of-your-personal-data"
          >
            <span className="icon icon-link" />
          </a>
          Transfer of Your Personal Data
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Your information, including Personal Data, is processed at the
          Company's operating offices and in any other places where the parties
          involved in the processing are located. It means that this information
          may be transferred to — and maintained on — computers located outside
          of Your state, province, country or other governmental jurisdiction
          where the data protection laws may differ than those from Your
          jurisdiction.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Your consent to this Privacy Policy followed by Your submission of
          such information represents Your agreement to that transfer.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The Company will take all steps reasonably necessary to ensure that
          Your data is treated securely and in accordance with this Privacy
          Policy and no transfer of Your Personal Data will take place to an
          organization or a country unless there are adequate controls in place
          including the security of Your data and other personal information.
        </p>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="delete-your-personal-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#delete-your-personal-data"
          >
            <span className="icon icon-link" />
          </a>
          Delete Your Personal Data
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          You have the right to delete or request that We assist in deleting the
          Personal Data that We have collected about You.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Our Service may give You the ability to delete certain information
          about You from within the Service.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          You may update, amend, or delete Your information at any time by
          signing in to Your Account, if you have one, and visiting the account
          settings section that allows you to manage Your personal information.
          You may also contact Us to request access to, correct, or delete any
          personal information that You have provided to Us.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Please note, however, that We may need to retain certain information
          when we have a legal obligation or lawful basis to do so.
        </p>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="disclosure-of-your-personal-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#disclosure-of-your-personal-data"
          >
            <span className="icon icon-link" />
          </a>
          Disclosure of Your Personal Data
        </h3>
        <h4
          className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
          id="business-transactions"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#business-transactions"
          >
            <span className="icon icon-link" />
          </a>
          Business Transactions
        </h4>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          If the Company is involved in a merger, acquisition or asset sale,
          Your Personal Data may be transferred. We will provide notice before
          Your Personal Data is transferred and becomes subject to a different
          Privacy Policy.
        </p>
        <h4
          className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
          id="law-enforcement"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#law-enforcement"
          >
            <span className="icon icon-link" />
          </a>
          Law enforcement
        </h4>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Under certain circumstances, the Company may be required to disclose
          Your Personal Data if required to do so by law or in response to valid
          requests by public authorities (e.g. a court or a government agency).
        </p>
        <h4
          className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
          id="other-legal-requirements"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#other-legal-requirements"
          >
            <span className="icon icon-link" />
          </a>
          Other legal requirements
        </h4>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The Company may disclose Your Personal Data in the good faith belief
          that such action is necessary to:
        </p>
        <ul className="my-6 ml-6 list-disc">
          <li className="mt-2">Comply with a legal obligation</li>
          <li className="mt-2">
            Protect and defend the rights or property of the Company
          </li>
          <li className="mt-2">
            Prevent or investigate possible wrongdoing in connection with the
            Service
          </li>
          <li className="mt-2">
            Protect the personal safety of Users of the Service or the public
          </li>
          <li className="mt-2">Protect against legal liability</li>
        </ul>
        <h3
          className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
          id="security-of-your-personal-data"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#security-of-your-personal-data"
          >
            <span className="icon icon-link" />
          </a>
          Security of Your Personal Data
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The security of Your Personal Data is important to Us, but remember
          that no method of transmission over the Internet, or method of
          electronic storage is 100% secure. While We strive to use commercially
          acceptable means to protect Your Personal Data, We cannot guarantee
          its absolute security.
        </p>
        <h2
          className="mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0"
          id="childrens-privacy"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#childrens-privacy"
          >
            <span className="icon icon-link" />
          </a>
          Children's Privacy
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Our Service does not address anyone under the age of 13. We do not
          knowingly collect personally identifiable information from anyone
          under the age of 13. If You are a parent or guardian and You are aware
          that Your child has provided Us with Personal Data, please contact Us.
          If We become aware that We have collected Personal Data from anyone
          under the age of 13 without verification of parental consent, We take
          steps to remove that information from Our servers.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          If We need to rely on consent as a legal basis for processing Your
          information and Your country requires consent from a parent, We may
          require Your parent's consent before We collect and use that
          information.
        </p>
        <h2
          className="mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0"
          id="links-to-other-websites"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#links-to-other-websites"
          >
            <span className="icon icon-link" />
          </a>
          Links to Other Websites
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Our Service may contain links to other websites that are not operated
          by Us. If You click on a third party link, You will be directed to
          that third party's site. We strongly advise You to review the Privacy
          Policy of every site You visit.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We have no control over and assume no responsibility for the content,
          privacy policies or practices of any third party sites or services.
        </p>
        <h2
          className="mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0"
          id="changes-to-this-privacy-policy"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#changes-to-this-privacy-policy"
          >
            <span className="icon icon-link" />
          </a>
          Changes to this Privacy Policy
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We may update Our Privacy Policy from time to time. We will notify You
          of any changes by posting the new Privacy Policy on this page.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We will let You know via email and/or a prominent notice on Our
          Service, prior to the change becoming effective and update the "Last
          updated" date at the top of this Privacy Policy.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </p>
        <h2
          className="mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0"
          id="contact-us"
        >
          <a
            className="subheading-anchor font-medium underline underline-offset-4"
            aria-label="Link to section"
            href="#contact-us"
          >
            <span className="icon icon-link" />
          </a>
          Contact Us
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          If you have any questions about this Privacy Policy, You can contact
          us:
        </p>
        <ul className="my-6 ml-6 list-disc">
          <li className="mt-2">
            By email:{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="mailto:support@douni.one"
            >
              support@douni.one
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
