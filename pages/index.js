import Head from 'next/head'
import { useState, useRef } from 'react'
import { ethers, utils } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import Wallet from '../components/Wallet'
import YourNFTs from '../components/YourNFTs'
import TotalSupply from '../components/TotalSupply'
import { mintNft } from '../helpers/mintNft'
import { generateSvgUri } from '../helpers/generateSvgUri'

export default function Home() {
  // UI state
  const [mintError, setMintError] = useState(false)
  const [mintMessage, setMintMessage] = useState('')
  const [mintLoading, setMintLoading] = useState(false)
  const initialValues = {
    fname: "",
    lname: "",
    country: "",
    phone: "",
    email: "",
    username: "  A Splendid Username  ",
  };
  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // Generate an URI for a random SVG image based on the forms inputs 
  const getSvgUri = () => {
    let theData = [values.fname, values.lname, values.country, values.phone, values.email, values.username].filter(Boolean).join('|');
    return generateSvgUri(values.username, theData);
  }

  // Call smart contract to mint NFT(s) from current address
  async function mintNFTs() {
    if (!hasEthereum()) return
    mintNft(setMintLoading, setMintMessage, setMintError, getSvgUri());
  }

  return (
    <div className="max-w-xl mt-36 mx-auto px-4">
      <Head>
        <title>Opossum - Web3Form</title>
        <meta name="description" content="Web3Form aka Project Opossum" />
        <link rel="icon" href="/Group-33.png" />
      </Head>
      <Wallet />
      <main className="space-y-8">
        {
          <>
            <h1 className="text-3xl font-semibold text-center">
              Web3Form <i>(aka &quot;Project Opossum&quot;)</i> v0.70
            </h1>
            <TotalSupply />
            <div className="space-y-8">
              <div className="rounded-xl shadow-lg bg-gray-100 p-4 lg:p-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Fill the form</h2>
                  <div><form>
                    <h3 className="text-base font-normal mb-1">First name</h3>
                    <input className="w-full"
                      value={values.fname}
                      onChange={handleInputChange}
                      name="fname"
                      label="fname"
                    />
                    <h3 className="text-base font-normal mb-1 mt-2">Last name</h3>
                    <input className="w-full"
                      value={values.lname}
                      onChange={handleInputChange}
                      name="lname"
                      label="lname"
                    />
                    <h3 className="text-base font-normal mb-1 mt-2">Country</h3>
                    <input className="w-full"
                      value={values.country}
                      onChange={handleInputChange}
                      name="country"
                      label="country"
                    />
                    <h3 className="text-base font-normal mb-1 mt-2">Phone</h3>
                    <input className="w-full"
                      value={values.phone}
                      onChange={handleInputChange}
                      name="phone"
                      label="phone"
                    />
                    <h3 className="text-base font-normal mb-1 mt-2">Mail</h3>
                    <input className="w-full"
                      value={values.email}
                      onChange={handleInputChange}
                      name="email"
                      label="email"
                    />
                    <h3 className="text-base font-normal mb-1 mt-2">Username</h3>
                    <input className="w-full"
                      value={values.username}
                      onChange={handleInputChange}
                      name="username"
                      label="username"
                    />
                  </form>
                  </div>
                  <div className="preview text-gray-600 text-sm mb-4 mt-6 justify-center items-center">
                    <h2 className="text-2xl font-semibold mb-2">Opossum Preview</h2>
                    <i>(OPOSSuM = <u>O</u>riginal <u>P</u>roof <u>O</u>f <u>S</u>plendid <u>Su</u>b<u>M</u>ission)</i>
                    <img alt="Opossum Preview" className="rounded-xl border-4 border-white bg-gray-100 mb-2 mt-4" src={getSvgUri()} />
                  </div>
                  <div className="flex">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl w-full mt-6"
                      onClick={mintNFTs}
                    >
                      {mintLoading ? 'Loading...' : 'Submit Form & Get Your Opossum'}
                    </button>
                  </div>
                  {mintMessage && <span className={mintError ? "text-red-600 text-xs mt-2 block" : "text-green-600 text-xs mt-2 block"}>{mintMessage}</span>}
                </div>
              </div>
            </div>
          </>
        }
        <YourNFTs />
      </main>

      <footer className="mt-20 text-center">
        <a
          href="https://github.com/guelowrd"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 mb-8 inline-block"
        >
          My Github
        </a>
      </footer>
    </div>
  )
}
