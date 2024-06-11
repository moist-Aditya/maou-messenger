const ContactUs = () => {
  return (
    <div className="p-4 px-4 md:px-7">
      <h1 className="text-5xl font-black">Contact Us</h1>
      <p className="text-xl font-semibold mt-4">
        We would love to hear from you!
      </p>
      <p className="text-lg">
        Contact us through any of the methods mentioned below.
      </p>

      <div className="flex flex-col gap-4 mt-14">
        {/* Map contact methods */}
        <p>Contact 1</p>
        <p>Contact 2</p>
        <p>Contact 3</p>
      </div>
    </div>
  )
}

export default ContactUs
