(function() {

    'use strict';

    angular.module('wfm.daterangepicker', ['styleguide.templates', 'angularMoment']).directive('dateRangePicker', ['$filter', dateRangePicker]);

    function dateRangePicker($filter) {
        return {
            templateUrl: 'js/date-range-picker/date-range-picker.tpl.html',
            scope: {
                startDate: '=',
                endDate: '=',
                disabled: '=?',
                errors: '=?',
            },
            controller: ['$scope', '$element', dateRangePickerCtrl],
            require: ['dateRangePicker'],
            link: postlink,
        };

        function dateRangePickerCtrl($scope, $element) {
            /* jshint validthis: true */
            var vm = this;
            $element.addClass('wfm-date-range-picker-wrap');
            $scope.setRangeClass = setRangeClass;
            $scope.isInvalid = isInvalid;

            vm.refreshDatepickers = refreshDatepickers;
            vm.checkValidity = checkValidity;

            function setRangeClass(date, mode) {
                if (mode === 'day') {
                    var startDate = $scope.startDate,
                    endDate = $scope.endDate;

                    if (startDate && endDate && startDate <= endDate) {
                        var dayToCheck = new Date(date).setHours(12, 0, 0, 0);
                        var start = new Date(startDate).setHours(12, 0, 0, 0);
                        var end = new Date(endDate).setHours(12, 0, 0, 0);

                        if (dayToCheck >= start && dayToCheck <= end) {
                            return 'in-date-range';
                        }
                    }
                }

                return '';
            }

            function isInvalid(symbol) {
                if (!$scope.errors) {
                    $scope.errors = [];
                }

                if (symbol) {
                    return $scope.errors.indexOf(symbol) >= 0;
                } else {
                    return $scope.errors.length > 0;
                }
            }

            function checkValidity() {
                var errors = [];
                if (!$scope.errors) {
                    $scope.errors = [];
                }

                if (!$scope.startDate || !$scope.endDate) {
                    errors.push('empty');
                } else if ($scope.startDate > $scope.endDate) {
                    errors.push('order');
                }

                if (errors.length !== $scope.errors.length || !(function compareArray(a1, a2) {
                    for (var i = 0; i < a1.length; i++) {
                        if (a1[i] !== a2[i]) { return false; }
                    }

                    return true;
                })(errors, $scope.errors)) {
                    $scope.errors = errors;
                }

            }

            function refreshDatepickers(startDate, endDate) {
                $scope.startDate = angular.copy($scope.startDate);
                $scope.endDate = angular.copy($scope.endDate);
            }
        }

        function postlink(scope, elem, attrs, ctrls) {
            var ctrl = ctrls[0];
            scope.$watch(function() {
                return {
                    startDate: scope.startDate ? $filter('date')(scope.startDate, 'yyyy-mm-dd') : '',
                    endDate: scope.endDate ? $filter('date')(scope.endDate, 'yyyy-mm-dd') : '',
                };
            }, function(newValue) {

                ctrl.checkValidity();
                ctrl.refreshDatepickers();
            }, true);

            scope.showMessage = !angular.isDefined(attrs.hideMessage);
        }
    }

})();
