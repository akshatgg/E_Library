// indiankanoonAPI.ts
import axios from "axios";

const INDIAN_KANOON_TOKEN = "f2d529bf4346005f6a35b7c011679c04886ae391";
const INDIAN_KANOON_ENDPOINT = "https://api.indiankanoon.org";

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



export async function fetchIndianKanoonTotalPages(): Promise<number> {
  try {
    const response = await axios.get(`${INDIAN_KANOON_ENDPOINT}total_pages/`, {
      headers: {
        Authorization: `Token ${INDIAN_KANOON_TOKEN}`,
        Accept: "application/json",
      },
    });

    return response.data?.total_pages || 0;
  } catch (error) {
    console.error("Error fetching total pages from Indian Kanoon:", error);
    return 0;
  }
}


export async function fetchCaseByTid(tid: number): Promise<any> {

  try {
    const response = await axios.post(`INDIAN_KANOON_ENDPOINT/doc/${tid}`, {
      headers: {
        'Authorization': `Token ${INDIAN_KANOON_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Error fetching TID ${tid}: ${response.statusText}`);
    }

    return response.data;
  } catch (error: any) {
    console.error('Error in fetchCaseByTid:', error.message);
    throw error;
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



