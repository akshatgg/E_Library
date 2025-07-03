// indiankanoonAPI.ts
import axios from "axios";

const INDIAN_KANOON_TOKEN = "d58940b08012f775f02a5f61063222a844ad3e24";
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
}

export async function fetchIndianKanoonData(props: FetchKanoonProps = {}): Promise<IKanoonResult[]> {
  try {
    const {
      formInput = "(income tax OR income-tax act OR income tax return OR gst OR g.s.t OR gst act OR section 139 of income tax act OR section 143 of income tax act OR section 147 of income tax act OR section 148 of income tax act)",
      pagenum = 0,
    } = props;

    const response = await axios.post(
      `${INDIAN_KANOON_ENDPOINT}/search/`,
      new URLSearchParams({
        formInput,
        pagenum: pagenum.toString(),
      }),
      {
        headers: {
          Authorization: `Token ${INDIAN_KANOON_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

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






