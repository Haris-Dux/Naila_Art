import React from 'react'

const PreviewBill = () => {
    return (
        <>
            <section>
                {/* HEADER */}
                <div className="header">
                    <div className="grid grid-cols-1 gap-0 lg:grid-cols-3 lg:gap-0">
                        <div className="logo bg-gray-200">
                            <img src="" alt="logo" />
                        </div>
                        <div className="company_header col-span-2 bg-gray-100">
                            <h2>Naila Arts</h2>
                        </div>
                    </div>
                </div>

                {/* COMPANY DETAILS */}
                <div className="company_details"></div>

                {/* PREVIEW TABLE */}
                <div className="preview_table"></div>

                {/* TOTAL */}
                <div className="total"></div>

                {/* ACCOUNT DETAILS */}
                <div className="account_details"></div>

                {/* FOOTER */}
                <div className="footer"></div>
            </section>
        </>
    )
}

export default PreviewBill
