// Copyright 2017, University of Colorado Boulder

/**
 * Panel that is responsible for adjusting the value of its corresponding mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var massString = require( 'string!MASSES_AND_SPRINGS/mass' );
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );

  /**
   * @param {Mass} mass
   * @param {Tandem} tandem
   * @constructor
   */
  function MassValueControlPanel( mass, tandem ) {

    // range for mass in kg
    var range = new Range( 50, 300 );

    var massInGramsProperty = new DynamicProperty( new Property( mass.massProperty ), {
      bidirectional: true,
      map: function( mass ) {
        return mass * 1000;
      },
      inverseMap: function( massInGrams ) {
        return massInGrams / 1000;
      }
    } );

    var numberControl = new NumberControl( massString, massInGramsProperty, range, {
      valuePattern: StringUtils.fillIn( massValueString, {
        mass: '{0}'
      } ),
      valueMaxWidth: 100,
      majorTickLength: 10,
      trackSize: new Dimension2( 100, 2 ),
      thumbSize: new Dimension2( 13, 22 ),
      titleFont: MassesAndSpringsConstants.TITLE_FONT,
      titleMaxWidth: 100,
      titleFontWeight: 'bold',
      arrowButtonScale: 0.7,
      layoutFunction: NumberControl.createLayoutFunction1( { arrowButtonsXSpacing: 5 } ),
      majorTicks: [
        {
          value: range.min,
          label: new Text( StringUtils.fillIn( massValueString, { mass: range.min } ), {
            font: MassesAndSpringsConstants.LABEL_FONT
          } )
        },
        {
          value: range.max,
          label: new Text( StringUtils.fillIn( massValueString, { mass: range.max } ), {
            font: MassesAndSpringsConstants.LABEL_FONT
          } )
        } ],
      delta: 1,
      tandem: tandem
    } );

    mass.options.adjustable = true;

    Panel.call( this, numberControl, {
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH,
      maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    } );
  }

  massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );
  return inherit( Panel, MassValueControlPanel );
} );
