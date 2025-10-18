from .sign import Sign
from pathlib import Path
from .name_search import NameSearch
from pdfminer.high_level import extract_pages


class Signature:
    def __init__(self, ns: NameSearch):
        self.ns = ns

    def single_sign(
        self,
        pdfimg: str,
        p12signature: str,
        password: str,
        pdfpath: str,
        search_word: str,
    ):
        """
        Single pdf sign on the last page on the pdf
        PARAMETERS
        - pdfimg: str, path to the image of the sign (preferably PNG format)
        - p12signature: str, path to the p12 file
        - password: str, password of the p12
        - pdfpath: str, path of the pdf
        - search_word: str, word we are searching for and signing next to
        """
        path = Path(pdfpath).expanduser()
        pages = extract_pages(path)
        all_results = self.ns.generate_results(pages, search_word)

        Sign(
            all_results[-1]["bbox"][-1]["x0"],
            all_results[-1]["bbox"][-1]["y0"],
            all_results[-1]["bbox"][-1]["x1"] + 500,  # width
            all_results[-1]["bbox"][-1]["y1"] + 30,  # height
            pdfimg,
            p12signature,
            password,
            pdfpath,
            all_results[-1]["page_no"],
        )

        return pdfpath

    def per_page_sign(
        self,
        pdfimg: str,
        p12signature: str,
        password: str,
        pdfpath: str,
        search_word: str,
    ):
        """
        Every page sign
        PARAMETERS:
        - pdfimg: str, path to the image of the sign (preferably PNG format)
        - p12signature: str, path to the p12 file
        - password: str, password of the p12
        - pdfpath: str, path of the pdf
        - search_word: str, word we are searching for and signing next to
        """
        path = Path(pdfpath).expanduser()
        pages = extract_pages(path)
        all_results = self.ns.generate_results(pages, search_word)
        idx = 0
        for i in all_results:
            Sign(
                all_results[idx]["bbox"][-1]["x0"],
                all_results[idx]["bbox"][-1]["y0"],
                all_results[idx]["bbox"][-1]["x1"] + 500,  # width
                all_results[idx]["bbox"][-1]["y1"] + 30,  # height
                pdfimg,
                p12signature,
                password,
                pdfpath,
                all_results[idx]["page_no"],
            )
            idx = idx + 1
        return pdfpath

    def per_name_sign(
        self,
        pdfimg: str,
        p12signature: str,
        password: str,
        pdfpath: str,
        search_word: str,
    ):
        """
        Every page sign
        PARAMETERS:
        - pdfimg: str, path to the image of the sign (preferably PNG format)
        - p12signature: str, path to the p12 file
        - password: str, password of the p12
        - pdfpath: str, path of the pdf
        - search_word: str, word we are searching for and signing next to
        """
        path = Path(pdfpath).expanduser()
        pages = extract_pages(path)
        all_results = self.ns.generate_results(pages, search_word)
        idx = 0

        for i in all_results:
            for bbox in all_results[idx]["bbox"]:
                Sign(
                    bbox["x0"],
                    bbox["y0"],
                    bbox["x1"] + 500,  # width
                    bbox["y1"] + 30,  # height
                    pdfimg,
                    p12signature,
                    password,
                    pdfpath,
                    all_results[idx]["page_no"],
                )
            idx += 1
        return pdfpath

    def mutliple_sign(
        self,
        pdfimg: str,
        p12signature: str,
        password: str,
        pdfpaths: list[str],
        search_word: str,
    ):
        """
        Multiple pdf sign on the last page of the pdf
        PARAMETERS
        - pdfimg: str, path to the image of the sign (preferably PNG format)
        - p12signature: str, path to the p12 file
        - password: str, password of the p12
        - pdfpaths: list[str], path of the pdf
        - search_word: str, word we are searching for and signing next to
        """
        for pdfpath in pdfpaths:
            path = Path(pdfpath).expanduser()
            pages = extract_pages(path)
            all_results = self.ns.generate_results(pages, search_word)

            Sign(
                all_results[-1]["bbox"][-1]["x0"],
                all_results[-1]["bbox"][-1]["y0"],
                all_results[-1]["bbox"][-1]["x1"] + 500,  # width
                all_results[-1]["bbox"][-1]["y1"] + 30,  # height
                pdfimg,
                p12signature,
                password,
                pdfpath,
                all_results[-1]["page_no"],
            )
        return pdfpaths

    def per_name_sign_batch(
        self,
        pdfimg: str,
        p12signature: str,
        password: str,
        pdfpaths: list[str],
        search_word: str,
    ):
        """
        Every page sign
        PARAMETERS:
        - pdfimg: str, path to the image of the sign (preferably PNG format)
        - p12signature: str, path to the p12 file
        - password: str, password of the p12
        - pdfpath: str, path of the pdf
        - search_word: str, word we are searching for and signing next to
        """
        for pdfpath in pdfpaths:
            path = Path(pdfpath).expanduser()
            pages = extract_pages(path)
            all_results = self.ns.generate_results(pages, search_word)
            idx = 0

            for i in all_results:
                for bbox in all_results[idx]["bbox"]:
                    Sign(
                        bbox["x0"],
                        bbox["y0"],
                        bbox["x1"] + 500,  # width
                        bbox["y1"] + 30,  # height
                        pdfimg,
                        p12signature,
                        password,
                        pdfpath,
                        all_results[idx]["page_no"],
                    )
                idx += 1

        return pdfpaths
