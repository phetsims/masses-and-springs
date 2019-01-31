// Copyright 2017-2019, University of Colorado Boulder

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
  var MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var massString = require( 'string!MASSES_AND_SPRINGS/mass' );
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );

  /**
   * @param {Mass} mass
   * @param {Node} massNodeIcon: icon that represents the mass to be adjusted
   * @param {Tandem} tandem
   * @param {object} options
   * @constructor
   */
  function MassValueControlPanel( mass, massNodeIcon, tandem, options ) {
    assert && assert( mass.adjustable === true, 'MassValueControlPanel should only adjust a mass that is adjustable.' );

    options = _.extend( {
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      fill: 'white',
      align: 'center',
      stroke: 'gray',
      yMargin: 6,
      xMargin: 6,
      tandem: tandem
    }, options );

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

    var trackSizeProperty = new Property( options.basics ? new Dimension2( 132, 0.1 ) : new Dimension2( 125, 0.1 ) );
    var valuePattern = StringUtils.fillIn( massValueString, { mass: '{0}' }, {
      font: new PhetFont( { size: 14, weight: 'bold' } )
    } );
    var numberControl = new NumberControl( massString, massInGramsProperty, range, {
      valuePattern: valuePattern,
      valueFont: new PhetFont( 14 ),
      majorTickLength: 10,
      titleFont: new PhetFont( { size: 16, weight: 'bold' } ),
      titleMaxWidth: 45,
      thumbSize: new Dimension2( 13, 24 ),
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
      stroke: null,
      valueMaxWidth: 100,
      sliderIndent: 7,
      constrainValue: function( value ) { return ( Util.roundSymmetric( value / 10 ) * 10); },
      majorTicks: [
        {
          value: range.min,
          label: new Text( String( range.min ), { font: new PhetFont( 14 ) } )
        },
        {
          value: range.max,
          label: new Text( String( range.max ), { font: new PhetFont( 14 ) } )
        }
      ],
      layoutFunction: NumberControl.createLayoutFunction4( {
        verticalSpacing: 8,
        arrowButtonsXSpacing: 5,
        hasReadoutProperty: new Property( true )
      } ),
      useRichText: true,
      decimalPlaces: 0,
      arrowButtonOptions: { arrowButtonScale: 0.5 },
      delta: 1,
      trackSize: trackSizeProperty.value
    } );
    var contentNode = new Node( { children: [ numberControl, massNodeIcon ] } );

    Panel.call( this, contentNode, options );

    massNodeIcon.leftTop = numberControl.leftTop.plus( new Vector2( 45, -2 ) );
    massNodeIcon.pickable = false;
  }

  massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );

  return inherit( Panel, MassValueControlPanel );
} );
