
import $ from 'jquery';

// Search Function
$(document).ready(() => {
    console.log("jQuery is working!");
    $("#searchInput").on("keyup", function(this: HTMLInputElement): void {
        const value: string = $(this).val() as string;

        // Filter table rows based on the search input
        $("table tbody tr").filter(function(this: HTMLElement): boolean {
            const rowText: string = $(this).text().toLowerCase();
            return rowText.indexOf(value.toLowerCase()) > -1;
        }).toggle();  // Toggle visibility of rows
    });
});
