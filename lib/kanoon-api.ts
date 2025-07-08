// indiankanoonAPI.ts
import axios from "axios";



const INDIAN_KANOON_TOKEN = process.env.NEXT_PUBLIC_KANOON_TOKEN||"";

const INDIAN_KANOON_ENDPOINT = process.env.NEXT_PUBLIC_KANOON_URL || "https://api.indiankanoon.org";

export interface IKanoonResult {
  tid: number;
  title: string;
  headline: string;
  publishdate: string;
  docsource: string;
  numcitedby: number;
  docsize: number;
}

interface FetchKanoonProps {
  formInput?: string;
  pagenum?: number;
  year?: number; // ✅ optional year filter (like 2019)
}

export async function fetchIndianKanoonData(props: FetchKanoonProps = {}): Promise<IKanoonResult[]> {
  try {
    const {
      formInput = "(income tax appellate tribunal OR ITAT OR income-tax appellate tribunal OR income tax appellate court)",
      pagenum = 0,
      year, // ✅ capture year from props
    } = props;
 
    // ✅ Append year to formInput if provided
    const finalQuery = year ? `${formInput} ${year}` : formInput;

    const params = new URLSearchParams();
    params.append("formInput", finalQuery);
    params.append("pagenum", pagenum.toString());

    const response = await axios.post(
      `https://api.indiankanoon.org/search/`,
      params,
      {
        headers: {
          Authorization: `Token ${INDIAN_KANOON_TOKEN}`,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
console.log("Response Data:", response.data);

    return response.data?.docs || [];
  } catch (error) {
    console.error("Error fetching Indian Kanoon data:", error);
    return [];
  }
}




export async function fetchCaseByTid(tid: number): Promise<any> {
  try {
    // Add extensive debugging
    console.log("=== DEBUG fetchCaseByTid ===");
    console.log("Input TID:", tid);
    console.log("TID type:", typeof tid);
    console.log("TID is number?", typeof tid === 'number');
    console.log("TID is NaN?", isNaN(tid));
    
    // Construct URL step by step
    const baseUrl = INDIAN_KANOON_ENDPOINT;
    const fullUrl = `${baseUrl}/doc/${tid}/`;
    
    console.log("Base URL:", baseUrl);
    console.log("Full URL:", fullUrl);
    console.log("Token (first 10 chars):", INDIAN_KANOON_TOKEN.substring(0, 10) + "...");
    
    // Validate TID before making request
    if (!tid || isNaN(tid) || tid <= 0) {
      throw new Error(`Invalid TID: ${tid}`);
    }
    
    console.log("Making POST request to:", fullUrl);
    
    const response = await axios.post(
      fullUrl,
      {}, // Empty data body for POST
      {
        headers: {
          Authorization: `Token ${INDIAN_KANOON_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    console.log("✅ Success! Response status:", response.status);
    console.log("Response data keys:", Object.keys(response.data || {}));
    
    return response.data;
  } catch (error: any) {
    console.error("❌ Error in fetchCaseByTid:");
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response statusText:", error.response.statusText);
      console.error("Response data:", error.response.data);
      console.error("Response headers:", error.response.headers);
      
      // Log the actual URL that failed
      console.error("Failed URL:", error.config?.url);
      
      throw new Error(`API Error ${error.response.status}: ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received");
      console.error("Request config:", error.request);
      throw new Error("No response from Indian Kanoon API");
    } else {
      console.error("Request setup error:", error.message);
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
}


export async function fetchTotalCountByCategory(props: FetchKanoonProps): Promise<number> {
  try {
    const {
      formInput = "(income tax appellate tribunal OR ITAT OR income-tax appellate tribunal OR income tax appellate court)",
      pagenum = 0,
      year,
    } = props;

    // Include year in the query if specified
    const finalQuery = year ? `${formInput} ${year}` : formInput;

    const params = new URLSearchParams();
    params.append("formInput", finalQuery);
    params.append("pagenum", pagenum.toString());

    const response = await axios.post(`${INDIAN_KANOON_ENDPOINT}/search/`, params, {
      headers: {
        Authorization: `Token ${INDIAN_KANOON_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Extract number from 'found': e.g., "11 - 20 of 13011"
    const foundText: string | undefined = response.data?.found;
    if (!foundText) return 0;

    const match = foundText.match(/of\s+(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;

  } catch (error) {
    console.error("Error fetching total count by category:", error);
    return 0;
  }
}



