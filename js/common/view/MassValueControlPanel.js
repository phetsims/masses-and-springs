// Copyright 2017-2018, University of Colorado Boulder

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
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var massString = require( 'string!MASSES_AND_SPRINGS/mass' );
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );

  /**
   * @param {Mass} mass
   * @param {Node} massNodeIcon: icon that represents the mass to be adjusted
   * @constructor
   */
  function MassValueControlPanel( mass, massNodeIcon ) {

    assert && assert( mass.adjustable === true, 'MassValueControlPanel should only adjust a mass that is adjustable.' );

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
      valueFont: new PhetFont( 12 ),
      majorTickLength: 10,
      titleFont: new PhetFont( { size: 16, weight: 'bold' } ),
      titleMaxWidth: 55,
      trackSize: new Dimension2( 125, 0.1 ),
      thumbSize: new Dimension2( 13, 24 ),
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
      stroke: null,
      valueMaxWidth: 100,
      sliderIndent: 7,
      majorTicks: [
        {
          value: range.min,
          label: new Text( String( range.min ), { font: new PhetFont( 12 ) } )
        },
        {
          value: range.max,
          label: new Text( String( range.max ), { font: new PhetFont( 12 ) } )
        }
      ],
      layoutFunction: NumberControl.createLayoutFunction1( {
        titleXSpacing: 65,
        ySpacing: 4,
        arrowButtonsXSpacing: 5
      } ),
      useRichText: true,
      decimalPlaces: 0,
      arrowButtonScale: 0.5,
      delta: 1
    } );

    var contentNode = new Node( { children: [ numberControl, massNodeIcon ] } );

    Panel.call( this, contentNode, {
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH,
      maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 8,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      fill: 'white',
      stroke: 'gray',
      yMargin: 3.5,
      xMargin: 6
    } );

    massNodeIcon.leftTop = numberControl.leftTop;
    massNodeIcon.pickable = false;
  }

  massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );
  return inherit( Panel, MassValueControlPanel );
} );
